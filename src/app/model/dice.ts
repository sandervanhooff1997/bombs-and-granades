import { randomDiceSide } from './utils/dice.utils';

export interface IDice {
  side: DiceSides;
  visible: boolean;
  optionable: boolean;
  picked: boolean;
  countableForBonus: boolean;
  scoreValue: number;
  rollable: boolean;

  // all transientForGroupBonus form a single group bonus when effect is active
  transientForGroupBonus: boolean;

  init(): void;
  roll(forceType: boolean): void;
  pick(): void;
  release(): void;
}

export class Dice implements IDice {
  side: DiceSides = DiceSides.Coin;
  visible = false;
  optionable: boolean = true;
  picked: boolean = false;
  countableForBonus: boolean = true;
  scoreValue: number = 0;
  rollable: boolean = true;
  transientForGroupBonus: boolean = false;

  init(): void {
    this.visible = false;
    this.optionable = true;
    this.picked = false;
    this.countableForBonus = true;
    this.scoreValue = 0;
    this.rollable = true;
    this.transientForGroupBonus = false;
    this.side = DiceSides.Coin;
  }

  roll(forceType: boolean): void {
    if (this.picked || !this.optionable) {
      return;
    }

    this.visible = true;
    this.side = forceType ? DiceSides.Coin : randomDiceSide();
    this.determineOptionable();
    this.determineCountableForBonus();
    this.determineScoreValue();
    this.determineRollable();
    this.determineTransientForGroupBonus();
  }

  pick(): void {
    this.picked = true;
    this.determineRollable();
  }

  release(): void {
    if (!this.optionable) {
      return;
    }

    this.picked = false;
    this.determineRollable();
  }

  private determineOptionable(): void {
    this.optionable = this.side !== DiceSides.Skull;
  }

  private determineCountableForBonus(): void {
    this.countableForBonus = this.side !== DiceSides.Skull;
  }

  private determineScoreValue(): void {
    this.scoreValue = diceScoreValueMap.get(this.side) ?? 0;
  }

  private determineRollable(): void {
    this.rollable = !this.picked && this.optionable;
  }

  private determineTransientForGroupBonus(): void {
    this.transientForGroupBonus = transientForGroupBonusMap.includes(this.side);
  }
}

export enum DiceSides {
  Coin = 'Coin',
  Diamond = 'Diamond',
  Swords = 'Swords',
  Monkey = 'Monkey',
  Bird = 'Bird',
  Skull = 'Skull',
}

export const diceScoreValueMap: Map<DiceSides, number> = new Map([
  [DiceSides.Coin, 100],
  [DiceSides.Diamond, 100],
]);

export const transientForGroupBonusMap: DiceSides[] = [
  DiceSides.Bird,
  DiceSides.Monkey,
];

export const groupedDiceBonusMap: Map<number, number> = new Map([
  [3, 100],
  [4, 200],
  [5, 500],
  [6, 1000],
  [7, 2000],
  [8, 4000],
]);
