import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGame } from '../model/game';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './action-buttons.component.html',
  styleUrl: './action-buttons.component.sass',
})
export class ActionButtonsComponent {
  @Input() game!: IGame;

  rollDice() {
    this.game.rollDice();
  }

  addScore() {
    this.game.completeTurn(true);
  }

  continueOnDeath() {
    this.game.completeTurn(false);
  }
}
