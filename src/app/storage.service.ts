import { Injectable } from '@angular/core';
import { CardDeck } from './model/card';
import { STORAGE_KEY } from './model/constants';
import { Dice } from './model/dice';
import { Game, IGame } from './model/game';
import { Player } from './model/player';
import { ScoreBoard } from './model/scoreboard';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageKey = STORAGE_KEY;

  constructor() {}

  saveGame(game: IGame): void {
    const gameData = JSON.stringify(game);
    localStorage.setItem(this.storageKey, gameData);
  }

  loadGame(): IGame | null {
    const gameData = localStorage.getItem(this.storageKey);
    if (gameData) {
      const parsedData = JSON.parse(gameData) as IGame;
      const game = new Game();

      // Populate the game instance with the parsed data
      Object.assign(game, parsedData);

      // Ensure nested objects are properly instantiated
      game.cardDeck = Object.assign(new CardDeck(), parsedData.cardDeck);
      game.dices = parsedData.dices.map((dice) =>
        Object.assign(new Dice(), dice)
      );
      game.players = parsedData.players.map((player) =>
        Object.assign(new Player(), player)
      );

      game.scoreBoard = Object.assign(
        new ScoreBoard(
          parsedData.scoreBoard!.maxScore,
          game.dices,
          game.cardDeck
        )
      );

      return game;
    }

    return null;
  }

  clearGame(): void {
    localStorage.removeItem(this.storageKey);
  }
}
