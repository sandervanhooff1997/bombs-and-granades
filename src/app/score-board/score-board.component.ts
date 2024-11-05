import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGame } from '../model/game';

@Component({
  selector: 'app-score-board',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.sass',
})
export class ScoreBoardComponent {
  @Input() game!: IGame;
}
