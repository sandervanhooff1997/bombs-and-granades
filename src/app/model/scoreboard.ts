import { ICardDeck } from './card';
import { MAX_SCORE_THRESHOLD, MIN_SCORE_THRESHOLD } from './constants';
import { DiceSides, groupedDiceBonusMap, IDice } from './dice';
import { AllDicesHaveValueEffect, IEffect } from './effect';
import { groupAndCountBySide } from './utils/dice.utils';
import { getCardEffect } from './utils/effect.utils';

export interface ICurrentScore {
  score: number;

  // extra score details, affected by the card decks's current card
  coins: number;
  diamonds: number;
  groupBonus: number;
  extraCoin: number;
  extraDiamond: number;
  minSwords: number;
  allDicesHaveValueBonus: number;
  factor: number;
  skulls: number;
  skullDeductTriggered: boolean;
  preserveScoreOnDeath: boolean;
  monkeysAreBirds: boolean;
}

export class CurrentScore implements ICurrentScore {
  score: number = 0;

  coins: number = 0;
  diamonds: number = 0;
  groupBonus: number = 0;
  extraCoin: number = 0;
  extraDiamond: number = 0;
  minSwords: number = 0;
  allDicesHaveValueBonus: number = 0;
  factor: number = 1;
  skulls: number = 0;
  skullDeductTriggered: boolean = false;
  preserveScoreOnDeath: boolean = false;
  monkeysAreBirds: boolean = false;
}

export interface IScoreBoard {
  currentScore: ICurrentScore;
  maxScore: number;
  currentPlayerIndex: number;

  dices: IDice[];
  cardDeck: ICardDeck;

  calculate(
    dice: IDice[],
    currentPlayerIndex: number,
    invertedSkulls: boolean
  ): void;
  validateMaxScore(): boolean;
  resetCurrentScore(currentPlayerIndex: number): void;
}

export class ScoreBoard implements IScoreBoard {
  currentScore: ICurrentScore = new CurrentScore();
  maxScore: number = 0;
  currentPlayerIndex: number = 0;

  dices: IDice[];
  cardDeck: ICardDeck;

  constructor(maxScore: number, dices: IDice[], cardDeck: ICardDeck) {
    this.maxScore = maxScore;
    this.dices = dices;
    this.cardDeck = cardDeck;
  }

  calculate(
    dice: IDice[],
    currentPlayerIndex: number,
    invertedSkulls = false
  ): void {
    this.resetCurrentScore(currentPlayerIndex);

    const effect = getCardEffect(this.dices, this.cardDeck);
    const groupedByDiceSide = groupAndCountBySide(dice);

    this.currentScore.skulls = this.calculateSkulls(effect);

    if (!invertedSkulls) {
      this.currentScore.coins = this.calculateDiceScoreSum(
        dice,
        DiceSides.Coin
      );
      this.currentScore.diamonds = this.calculateDiceScoreSum(
        dice,
        DiceSides.Diamond
      );
      this.currentScore.groupBonus = this.calculateCountBySideBonus(
        groupedByDiceSide,
        effect
      );
      this.currentScore.extraCoin = effect.scoreExtraCoinValue;
      this.currentScore.extraDiamond = effect.scoreExtraDiamondValue;
      this.currentScore.minSwords = effect.minSwords;
      this.currentScore.factor = effect.scoreFactor;
      this.currentScore.preserveScoreOnDeath = effect.preserveScoreOnDeath;

      // only count other scores if the card requirement is met
      const minSwordsAchieved = this.currentScore.minSwords >= 0;
      if (minSwordsAchieved) {
        // only calculate this (somewhat heavy) effect at this moment in time
        const allDicesHaveValueBonus = new AllDicesHaveValueEffect(
          effect
        ).process(dice).allDicesHaveValueBonus;

        this.currentScore.allDicesHaveValueBonus = allDicesHaveValueBonus;

        this.currentScore.score +=
          this.currentScore.coins +
          this.currentScore.diamonds +
          this.currentScore.groupBonus +
          this.currentScore.extraCoin +
          this.currentScore.extraDiamond +
          this.currentScore.allDicesHaveValueBonus;
      }

      // min swords can also have a negative impact on the score. Hence why this should always be calculated at the end
      this.currentScore.score =
        (this.currentScore.score + this.currentScore.minSwords) *
        this.currentScore.factor;
    } else {
      this.currentScore.score = this.calculateInvertedSkullScoreSum(
        this.currentScore.skulls
      );
    }
  }

  validateMaxScore(): boolean {
    const minMaxScoreExceed =
      this.maxScore < MIN_SCORE_THRESHOLD ||
      this.maxScore > MAX_SCORE_THRESHOLD;

    if (minMaxScoreExceed) {
      alert(
        `Min ${MIN_SCORE_THRESHOLD} score, max ${MAX_SCORE_THRESHOLD} score`
      );
      return false;
    }

    return true;
  }

  resetCurrentScore(currentPlayerIndex: number): void {
    if (currentPlayerIndex !== this.currentPlayerIndex) {
      this.currentScore = new CurrentScore();
    }

    this.currentPlayerIndex = currentPlayerIndex;
    this.currentScore.score = 0;
  }

  private calculateSkulls(effect: IEffect): number {
    const skullDices = this.dices.filter((d) => d.side == DiceSides.Skull);

    if (
      skullDices.length > 0 &&
      !this.currentScore.skullDeductTriggered &&
      effect.skullsAddedOrDeducted < 0
    ) {
      this.currentScore.skullDeductTriggered = true;

      for (let index = 0; index < -effect.skullsAddedOrDeducted; index++) {
        skullDices[index].optionable = true;
        skullDices[index].rollable = true;
      }
    }

    if (effect.skullsAddedOrDeducted !== 0) {
      return skullDices.length + effect.skullsAddedOrDeducted;
    }

    return skullDices.length;
  }

  private calculateCountBySideBonus(
    map: Map<DiceSides, { count: number; item: IDice }>,
    effect: IEffect
  ): number {
    let bonus = 0;
    let transientGroupDiceCount = 0;

    map.forEach((group) => {
      if (group.item.countableForBonus && group.item.picked) {
        // check if there is an extra coin effect
        const addExtraCoin =
          !!effect.scoreExtraCoinValue && group.item.side === DiceSides.Coin;

        // check if there is an extra diamond effect
        const addExtraDiamond =
          !!effect.scoreExtraDiamondValue &&
          group.item.side === DiceSides.Diamond;

        const addExtraItem = addExtraCoin || addExtraDiamond ? 1 : 0;

        // either sum all transient dices or add the bonus + extra item immediately
        if (effect.birdsAreMonkeys && group.item.transientForGroupBonus) {
          transientGroupDiceCount += group.count;
        } else {
          bonus += groupedDiceBonusMap.get(group.count + addExtraItem) ?? 0;
        }
      }
    });

    if (transientGroupDiceCount > 0) {
      bonus += groupedDiceBonusMap.get(transientGroupDiceCount) ?? 0;
    }

    return bonus;
  }

  private calculateDiceScoreSum(dice: IDice[], diceSide: DiceSides): number {
    return dice
      .filter((d) => d.side === diceSide && d.picked)
      .map((d) => d.scoreValue)
      .reduce((total, current) => total + current, 0);
  }

  private calculateInvertedSkullScoreSum(skulls: number): number {
    return skulls * -100;
  }
}
