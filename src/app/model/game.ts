import { CardDeck, ICardDeck } from './card';
import { MAX_PLAYERS, MIN_PLAYERS } from './constants';
import { Dice, DiceSides, IDice } from './dice';
import { SkullsInvertedEffect } from './effect';
import { IPlayer, Player } from './player';
import { IScoreBoard, ScoreBoard } from './scoreboard';
import { sortDice } from './utils/dice.utils';
import { getCardEffect } from './utils/effect.utils';

export interface IGame {
  scoreBoard: IScoreBoard | null;
  cardDeck: ICardDeck;
  dicesLastThrow: IDice[];
  dices: IDice[];
  players: IPlayer[];

  started: boolean;
  finished: boolean;
  diceRollable: boolean;
  scoreAddable: boolean;

  currentPlayerIndex: number;
  currentPlayerFirstThrow: boolean;
  currentPlayerDeath: boolean;
  invertedSkulls: boolean;

  start(numPlayers: number, maxScore: number): void;

  rollDice(): void;
  pickDice(dice: IDice): void;
  releaseDice(dice: IDice): void;
  completeTurn(countScore: boolean): void;

  determineDiceRollable(): void;
  determineDeath(): void;
}

export class Game implements IGame {
  scoreBoard: IScoreBoard | null = null;
  cardDeck: ICardDeck = new CardDeck();
  dicesLastThrow: IDice[] = [];
  dices: IDice[] = [];
  players: IPlayer[] = [];

  started: boolean = false;
  finished: boolean = false;
  diceRollable: boolean = true;
  scoreAddable: boolean = false;

  currentPlayerIndex = 0;
  currentPlayerFirstThrow = true;
  currentPlayerDeath = false;
  invertedSkulls = false;

  start(numPlayers: number, maxScore = 5000): void {
    if (!this.validateAndCreatePlayers(numPlayers)) {
      return;
    }

    this.dicesLastThrow = [];

    this.started = false;
    this.diceRollable = true;
    this.scoreAddable = false;

    this.currentPlayerIndex = 0;
    this.currentPlayerFirstThrow = true;
    this.currentPlayerDeath = false;
    this.invertedSkulls = false;

    this.generateDices();
    this.cardDeck = new CardDeck();
    this.scoreBoard = new ScoreBoard(maxScore, this.dices, this.cardDeck);
    if (!this.scoreBoard.validateMaxScore()) {
      return;
    }
  }

  rollDice(): void {
    let count = 0;
    this.dices.forEach((d) => {
      d.roll(false);
      count++;
    });

    sortDice(this.dices);
    this.determineDeath();
    this.scoreBoard!.calculate(
      this.dices,
      this.currentPlayerIndex,
      this.invertedSkulls
    );
    this.determineDiceRollable();
    this.scoreAddable = true;
    this.currentPlayerFirstThrow = false;

    // make deep copy that holds a history to compare with the next throw
    this.dicesLastThrow = JSON.parse(JSON.stringify(this.dices));
  }

  pickDice(dice: IDice): void {
    dice.pick();

    this.scoreBoard!.calculate(
      this.dices,
      this.currentPlayerIndex,
      this.invertedSkulls
    );

    this.determineDiceRollable();
  }

  releaseDice(dice: IDice): void {
    dice.release();

    this.scoreBoard!.calculate(
      this.dices,
      this.currentPlayerIndex,
      this.invertedSkulls
    );

    this.determineDiceRollable();
  }

  determineDiceRollable(): void {
    const atLeastTwoRollableDices =
      this.dices.filter((d) => d.rollable).length >= 2;

    // When skulls are inverted, also check if this throw has more skulls then the previous one
    if (this.invertedSkulls) {
      const oneMoreSkullThrown =
        this.dicesLastThrow.filter((d) => d.side === DiceSides.Skull).length <
        this.dices.filter((d) => d.side === DiceSides.Skull).length;

      this.diceRollable = atLeastTwoRollableDices && oneMoreSkullThrown;

      this.currentPlayerDeath = !oneMoreSkullThrown;
    } else {
      this.diceRollable = atLeastTwoRollableDices;
    }
  }

  determineDeath(): void {
    const effect = getCardEffect(this.dices, this.cardDeck);
    const skullDices = this.dices.filter(
      (d) => d.side == DiceSides.Skull
    ).length;

    this.invertedSkulls =
      this.invertedSkulls === true
        ? true
        : new SkullsInvertedEffect(
            this.currentPlayerFirstThrow,
            effect.skullsAddedOrDeducted
          ).process(this.dices).skullsInverted;

    if (!this.invertedSkulls) {
      this.currentPlayerDeath = skullDices + effect.skullsAddedOrDeducted >= 3;
    }
  }

  completeTurn(countScore: boolean): void {
    const currentPlayer = this.players[this.currentPlayerIndex];

    if (countScore || this.scoreBoard!.currentScore.preserveScoreOnDeath) {
      currentPlayer.score += this.scoreBoard!.currentScore.score;
    }

    if (this.invertedSkulls) {
      const otherPlayers = [
        ...this.players.slice(0, this.currentPlayerIndex),
        ...this.players.slice(this.currentPlayerIndex + 1),
      ];

      otherPlayers.forEach(
        (p) => (p.score += this.scoreBoard!.currentScore.score)
      );
    }

    if (this.scoreBoard!.currentScore.minSwords < 0) {
      currentPlayer.score += this.scoreBoard!.currentScore.minSwords;
    }

    if (currentPlayer.score >= this.scoreBoard!.maxScore) {
      // timeout updates view before showing the alert
      setTimeout(() => {
        this.finished = true;
      }, 100);
      return;
    }

    // order matters
    this.continueToNextPlayer();
    this.scoreBoard!.resetCurrentScore(this.currentPlayerIndex); // this new index resets the scoreboard as well
    this.cardDeck.flushCurrentCard();
    this.scoreAddable = false;
    this.dices.forEach((d) => d.init());
    this.determineDiceRollable();
  }

  private validateAndCreatePlayers(numPlayers: number): boolean {
    const minMaxPlayersExceeded =
      numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS;

    if (minMaxPlayersExceeded) {
      alert(`Min ${MIN_PLAYERS} players, max ${MAX_PLAYERS} players`);
      return false;
    }

    const players: IPlayer[] = [];
    for (let index = 0; index < numPlayers; index++) {
      players.push(new Player());
    }

    this.players = players;
    this.currentPlayerIndex = 0;
    this.currentPlayerFirstThrow = true;
    this.currentPlayerDeath = false;

    return true;
  }

  private generateDices(): void {
    this.dices = [];

    for (let index = 0; index < 8; index++) {
      this.dices.push(new Dice());
    }
  }

  private continueToNextPlayer(): void {
    this.currentPlayerIndex == this.players.length - 1
      ? (this.currentPlayerIndex = 0)
      : this.currentPlayerIndex++;

    this.currentPlayerDeath = false;
    this.currentPlayerFirstThrow = true;
    this.invertedSkulls = false;
    this.dicesLastThrow = [];
  }
}
