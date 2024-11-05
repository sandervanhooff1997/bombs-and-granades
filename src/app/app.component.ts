import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ActionButtonsComponent } from './action-buttons/action-buttons.component';
import { CardsComponent } from './cards/cards.component';
import { ConfirmAlertComponent } from './confirm-alert/confirm-alert.component';
import { DicesComponent } from './dices/dices.component';
import { Game, IGame } from './model/game';
import { PlayersComponent } from './players/players.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { StartFormComponent } from './start-form/start-form.component';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  game: IGame | null = null;
  gameData = '';

  constructor() {
    // this.startGame({
    //   numPlayers: 3,
    //   maxScore: 5000,
    // });
  }

  startGame(data: { numPlayers: number; maxScore: number }) {
    this.game = new Game();
    this.game.start(data.numPlayers, data.maxScore);
  }

  reset() {
    this.game = null;
  }
}
