import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGame } from '../model/game';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.sass',
})
export class PlayersComponent {
  @Input() game!: IGame;
}
