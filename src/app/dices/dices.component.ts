import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiceSides, IDice } from '../model/dice';
import { IGame } from '../model/game';

@Component({
  selector: 'app-dices',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './dices.component.html',
  styleUrl: './dices.component.sass',
})
export class DicesComponent {
  @Input() game!: IGame;

  diceSideSkull = DiceSides.Skull;

  pickDice(d: IDice) {
    this.game.pickDice(d);
  }

  releaseDice(d: IDice) {
    this.game.releaseDice(d);
  }
}
