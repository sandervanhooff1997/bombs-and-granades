import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { ConfirmAlertComponent } from '../confirm-alert/confirm-alert.component';
import { IGame } from '../model/game';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-current-game-stats',
  standalone: true,
  imports: [CommonModule, ConfirmAlertComponent],
  templateUrl: './current-game-stats.component.html',
  styleUrl: './current-game-stats.component.sass',
})
export class CurrentGameStatsComponent {
  @Input() game!: IGame;
  @Output() stopGame = new EventEmitter<void>();

  requestSave = false;
  requestRestart = false;
  requestStop = false;

  constructor(private readonly storageService: StorageService) {}

  onSaveGame(): void {
    this.storageService.saveGame(this.game);
  }

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

    this.stopGame.emit();
  }
}
