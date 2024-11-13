import { shuffleArray } from './utils/array.utils';

export enum CardType {
  GetTwoSwords = 'Get two swords',
  GetThreeSwords = 'Get three swords',
  GetFourSwords = 'Get four swords',
  Diamond = 'Diamond',
  Coin = 'Coin',
  MonkeysAreBirds = 'Monkeys & Birds',
  DoubleThePoints = 'Double the points',
  OneSkullAdded = 'One skull added',
  TwoSkullsAdded = 'Two skulls added',
  OneSkullDeducted = 'One skull deducted',
  TreasureChest = 'Treasure chest',
}

export const cardCountMap: Map<CardType, number> = new Map([
  [CardType.GetTwoSwords, 2],
  [CardType.GetThreeSwords, 2],
  [CardType.GetFourSwords, 2],
  [CardType.Diamond, 4],
  [CardType.Coin, 4],
  [CardType.DoubleThePoints, 4],
  [CardType.OneSkullAdded, 3],
  [CardType.TwoSkullsAdded, 2],
  [CardType.OneSkullDeducted, 4],
  [CardType.TreasureChest, 4],
  [CardType.MonkeysAreBirds, 4],
]);

export interface ICard {
  type: CardType;
}

export class Card implements ICard {
  type: CardType;

  constructor(type: CardType) {
    this.type = type;
  }
}

export interface ICardDeck {
  cards: ICard[];
  cardsAvailable: ICard[];
  currentCard: ICard | null;
  cardsPlayed: ICard[];

  init(): void;
  pickCurrentCard(): void;
  flushCurrentCard(): void;
}

export class CardDeck implements ICardDeck {
  cards: ICard[] = [];
  cardsAvailable: ICard[] = [];
  currentCard: ICard | null = null;
  cardsPlayed: ICard[] = [];

  constructor() {
    this.generateCards();
    this.init();
  }

  init(): void {
    this.shuffleCards();
    this.cardsAvailable = [...this.cards];
    this.cardsPlayed = [];
  }

  pickCurrentCard() {
    // this.currentCard =
    //   this.cardsAvailable.find((c) => c.type == CardType.OneSkullDeducted) ??
    //   this.cardsAvailable[0];
    const lastCardIndex = this.cardsAvailable.length - 1;
    this.currentCard = this.cardsAvailable[lastCardIndex];
    this.cardsAvailable.splice(lastCardIndex, 1);

    if (!this.cardsAvailable.length) {
      this.init();
    }
  }

  flushCurrentCard(): void {
    if (!this.currentCard) {
      return;
    }

    this.cardsPlayed.push(this.currentCard);
    this.currentCard = null;
  }

  private generateCards(): void {
    cardCountMap.forEach((amount, cardType) => {
      for (let index = 0; index < amount; index++) {
        this.cards.push(new Card(cardType));
      }
    });
  }

  private shuffleCards(): void {
    this.cards = shuffleArray(this.cards);
  }
}
