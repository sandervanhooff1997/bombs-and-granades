export interface IPlayer {
  name: string;
  score: number;
  scoreHistory: number[];

  changeScore(change: number): void;
}

export class Player implements IPlayer {
  name: string;
  score: number = 0;
  scoreHistory: number[] = [];

  constructor(name: string) {
    this.name = name;
  }

  changeScore(change: number): void {
    this.score += change;
    this.scoreHistory.push(this.score);
  }
}
