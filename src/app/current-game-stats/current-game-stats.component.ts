import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConfirmAlertComponent } from '../confirm-alert/confirm-alert.component';
import { IGame } from '../model/game';

@Component({
  selector: 'app-current-game-stats',
  standalone: true,
  imports: [CommonModule, ConfirmAlertComponent],
  templateUrl: './current-game-stats.component.html',
  styleUrl: './current-game-stats.component.sass',
})
export class CurrentGameStatsComponent {
  @Input() game!: IGame;

  requestRestart = false;
  requestStop = false;

  onRestartGame(confirmed: boolean): void {
    if (!confirmed) {
      this.requestRestart = false;
      return;
    }

    // todo : restart game
  }
  onStopGame(confirmed: boolean): void {
    if (!confirmed) {
      this.requestStop = false;
      return;
    }

    // todo : stop game
  }
}
