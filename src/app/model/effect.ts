import { CardType } from './card';
import {
  ALL_DICES_HAVE_VALUE,
  FOUR_SWORDS_FACTOR as FOUR_SWORDS_SCORE,
  THREE_SWORDS_FACTOR as THREE_SWORDS_SCORE,
  TWO_SWORDS_FACTOR as TWO_SWORDS_SCORE,
} from './constants';
import { DiceSides, groupedDiceBonusMap, IDice } from './dice';
import { groupAndCountBySide } from './utils/dice.utils';

export interface IEffect {
  // Coin
  scoreExtraCoinValue: number;
  // Diamond
  scoreExtraDiamondValue: number;
  // DoubleThePoints
  scoreFactor: number;
  // Treasure Chest
  preserveScoreOnDeath: boolean;
  // Birds are monkeys
  birdsAreMonkeys: boolean;
  // Skulls
  skullsAddedOrDeducted: number;
  // Inverted skull values (4 skulls on first throw)
  skullsInverted: boolean;
  // Swords
  minSwords: number;
  // All dices have add up to a score value
  allDicesHaveValueBonus: number;

  process(dices: IDice[], firstThrow: boolean): IEffect;
}

export class Effect implements IEffect {
  scoreExtraCoinValue: number = 0;
  scoreExtraDiamondValue: number = 0;
  scoreFactor: number = 1;
  preserveScoreOnDeath: boolean = false;
  birdsAreMonkeys: boolean = false;
  skullsAddedOrDeducted: number = 0;
  skullsInverted: boolean = false;
  minSwords: number = 0;
  allDicesHaveValueBonus: number = 0;

  process(_: IDice[]): IEffect {
    return new Effect();
  }
}

export class GetTwoSwordsEffect extends Effect {
  override process(dices: IDice[]): IEffect {
    const effect = new Effect();
    const valid =
      dices.filter((d) => d.side === DiceSides.Swords && d.picked).length >= 2;
    effect.minSwords = valid ? TWO_SWORDS_SCORE : -TWO_SWORDS_SCORE;

    return effect;
  }
}

export class GetThreeSwordsEffect extends Effect {
  override process(dices: IDice[]): IEffect {
    const effect = new Effect();
    const valid =
      dices.filter((d) => d.side === DiceSides.Swords && d.picked).length >= 3;
    effect.minSwords = valid ? THREE_SWORDS_SCORE : -THREE_SWORDS_SCORE;

    return effect;
  }
}

export class GetFourSwordsEffect extends Effect {
  override process(dices: IDice[]): IEffect {
    const effect = new Effect();
    const valid =
      dices.filter((d) => d.side === DiceSides.Swords && d.picked).length >= 4;
    effect.minSwords = valid ? FOUR_SWORDS_SCORE : -FOUR_SWORDS_SCORE;

    return effect;
  }
}

export class DiamondEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.scoreExtraDiamondValue = 100;
    return effect;
  }
}

export class CoinEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.scoreExtraCoinValue = 100;
    return effect;
  }
}

export class DoubleThePointsEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.scoreFactor = 2;
    return effect;
  }
}

export class OneSkullAddedEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.skullsAddedOrDeducted = 1;
    return effect;
  }
}

export class TwoSkullsAddedEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.skullsAddedOrDeducted = 2;
    return effect;
  }
}

export class OneSkullDeductedEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.skullsAddedOrDeducted = -1;
    return effect;
  }
}

export class TreasureChestEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.preserveScoreOnDeath = true;
    return effect;
  }
}

export class MonkeysAreBirdsEffect extends Effect {
  override process(_: IDice[]): IEffect {
    const effect = new Effect();
    effect.birdsAreMonkeys = true;
    return effect;
  }
}

export class AllDicesHaveValueEffect extends Effect {
  currentCardEffect: IEffect;

  constructor(currentCardEffect: IEffect) {
    super();

    this.currentCardEffect = currentCardEffect;
  }

  override process(dices: IDice[]): IEffect {
    // fail if there is any unpicked, a negative min swords score or any skulls occur
    if (
      dices.filter((d) => !d.picked).length > 0 ||
      this.currentCardEffect.minSwords < 0 ||
      dices.filter((d) => d.side === DiceSides.Skull).length > 0
    ) {
      return this.fail();
    }

    // remove any valueble dices (diamonds/coins) and skulls
    dices = dices.filter(
      (d) => d.scoreValue === 0 || d.side === DiceSides.Skull
    );

    // validate on the birds are monkeys effect
    const birdsAndMonkeys = dices.filter(
      (d) => d.side === DiceSides.Bird || d.side === DiceSides.Monkey
    );
    if (
      this.currentCardEffect.birdsAreMonkeys &&
      (groupedDiceBonusMap.get(birdsAndMonkeys.length) ?? 0 <= 0)
    ) {
      return this.fail();
    }

    // finally, validate if every grouped dice side results in a grouped bonus
    const groupedByDiceSide = groupAndCountBySide(dices);
    const allDiceSidesHaveGroupBonus = Array.from(
      groupedByDiceSide.values()
    ).every((value) => groupedDiceBonusMap.get(value.count) ?? 0 > 0);

    if (!allDiceSidesHaveGroupBonus) {
      return this.fail();
    }

    return this.succeed();
  }

  private fail(): IEffect {
    return new Effect();
  }

  private succeed(): IEffect {
    const effect = new Effect();
    effect.allDicesHaveValueBonus = ALL_DICES_HAVE_VALUE;
    return effect;
  }
}

export class SkullsInvertedEffect extends Effect {
  firstThrow: boolean;
  addedOrDeductedSkulls: number;

  constructor(firstThrow: boolean, addedOrDeductedSkulls: number) {
    super();
    this.firstThrow = firstThrow;
    this.addedOrDeductedSkulls = addedOrDeductedSkulls;
  }

  override process(dices: IDice[]): IEffect {
    const effect = new Effect();

    if (
      this.firstThrow &&
      dices.filter((d) => d.side === DiceSides.Skull).length +
        this.addedOrDeductedSkulls >=
        4
    ) {
      effect.skullsInverted = true;
    }

    return effect;
  }
}

type CardEffect = (dices: IDice[]) => IEffect;

const GetTwoSwordsCallback: CardEffect = (dices: IDice[]) =>
  new GetTwoSwordsEffect().process(dices);
const GetThreeSwordsCallback: CardEffect = (dices: IDice[]) =>
  new GetThreeSwordsEffect().process(dices);
const GetFourSwordsCallback: CardEffect = (dices: IDice[]) =>
  new GetFourSwordsEffect().process(dices);
const DiamondEffectCallback: CardEffect = (dices: IDice[]) =>
  new DiamondEffect().process(dices);
const CoinEffectCallback: CardEffect = (dices: IDice[]) =>
  new CoinEffect().process(dices);
const DoubleThePointsCallback: CardEffect = (dices: IDice[]) =>
  new DoubleThePointsEffect().process(dices);
const OneSkullAddedCallback: CardEffect = (dices: IDice[]) =>
  new OneSkullAddedEffect().process(dices);
const TwoSkullsAddedCallback: CardEffect = (dices: IDice[]) =>
  new TwoSkullsAddedEffect().process(dices);
const OneSkullDeductedCallback: CardEffect = (dices: IDice[]) =>
  new OneSkullDeductedEffect().process(dices);
const TreasureChestEffectCallback: CardEffect = (dices: IDice[]) =>
  new TreasureChestEffect().process(dices);
const MonkeysAreBirdsEffectCallback: CardEffect = (dices: IDice[]) =>
  new MonkeysAreBirdsEffect().process(dices);

export const cardEffectMap: Map<CardType, CardEffect> = new Map([
  [CardType.GetTwoSwords, GetTwoSwordsCallback],
  [CardType.GetThreeSwords, GetThreeSwordsCallback],
  [CardType.GetFourSwords, GetFourSwordsCallback],
  [CardType.Diamond, DiamondEffectCallback],
  [CardType.Coin, CoinEffectCallback],
  [CardType.DoubleThePoints, DoubleThePointsCallback],
  [CardType.OneSkullAdded, OneSkullAddedCallback],
  [CardType.TwoSkullsAdded, TwoSkullsAddedCallback],
  [CardType.OneSkullDeducted, OneSkullDeductedCallback],
  [CardType.TreasureChest, TreasureChestEffectCallback],
  [CardType.MonkeysAreBirds, MonkeysAreBirdsEffectCallback],
]);
