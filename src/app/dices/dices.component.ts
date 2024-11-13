import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
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

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  pickDice(d: IDice) {
    this.game.pickDice(d);
  }

  releaseDice(d: IDice) {
    this.game.releaseDice(d);
  }

  pickable(d: IDice): boolean {
    return !d.picked && d.optionable && d.side !== DiceSides.Skull;
  }

  skull(d: IDice): boolean {
    return d.side === DiceSides.Skull;
  }

  deductedSkull(d: IDice): boolean {
    return d.side === DiceSides.Skull && d.optionable;
  }

  releaseable(d: IDice): boolean {
    return d.picked && d.optionable;
  }
}
