import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { CardsComponent } from './cards/cards.component';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert.component';
import { CurrentGameStatsComponent } from './current-game-stats/current-game-stats.component';
import { DicesComponent } from './dices/dices.component';
import { Game, IGame } from './model/game';
import { PlayersComponent } from './players/players.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { StartFormComponent } from './start-form/start-form.component';
import { StorageService } from './storage.service';
import { ToastComponent } from './toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    PlayersComponent,
    ScoreBoardComponent,
    ActionButtonsComponent,
    DicesComponent,
    CardsComponent,
    StartFormComponent,
    ConfirmAlertComponent,
    CurrentGameStatsComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  game: IGame | null = null;
  gameData = '';

  constructor(private readonly storageService: StorageService) {
    this.game = storageService.loadGame();
    console.log(this.game);
  }

  startGame(data: { numPlayers: number; maxScore: number }) {
    this.game = new Game();
    this.game.start(data.numPlayers, data.maxScore);
  }

  reset() {
    this.storageService.clearGame();
    this.game = null;
  }
}
