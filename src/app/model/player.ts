export interface IPlayer {
  score: number;
}

export class Player implements IPlayer {
  score: number = 0;
}
