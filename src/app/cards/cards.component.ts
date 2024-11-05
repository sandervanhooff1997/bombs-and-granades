import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IGame } from '../model/game';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.sass',
})
export class CardsComponent {
  @Input() game!: IGame;

  pickCurrentCard() {
    this.game.cardDeck.pickCurrentCard();
  }
}
