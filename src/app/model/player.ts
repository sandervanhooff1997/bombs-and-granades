export interface IPlayer {
  score: number;
  scoreHistory: number[];

  changeScore(change: number): void;
}

export class Player implements IPlayer {
  score: number = 0;
  scoreHistory: number[] = [];

  changeScore(change: number): void {
    this.score += change;
    this.scoreHistory.push(this.score);
  }
}
