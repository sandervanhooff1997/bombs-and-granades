import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAX_PLAYERS,
  MAX_SCORE_THRESHOLD,
  MIN_PLAYERS,
  MIN_SCORE_THRESHOLD,
} from '../model/constants';

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.sass',
})
export class StartFormComponent {
  @Output() onGameStart = new EventEmitter<{
    numPlayers: number;
    maxScore: number;
  }>();
  gameTitle = 'Bombs & Granades';
  myForm!: FormGroup;
  numPlayersInput = 'numPlayers';
  maxScoreInput = 'maxScore';
  minPlayers = MIN_PLAYERS;
  maxPlayers = MAX_PLAYERS;
  minScore = MIN_SCORE_THRESHOLD;
  maxScore = MAX_SCORE_THRESHOLD;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.myForm = this.fb.group({
      numPlayers: [
        2,
        [
          Validators.required,
          Validators.min(this.minPlayers),
          Validators.max(this.maxPlayers),
        ],
      ],
      maxScore: [
        5000,
        [
          Validators.required,
          Validators.min(this.minScore),
          Validators.max(this.maxScore),
        ],
      ],
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.myForm.valid) {
      this.onGameStart.emit({
        numPlayers: this.myForm.get(this.numPlayersInput)?.value ?? 0,
        maxScore: this.myForm.get(this.maxScoreInput)?.value ?? 0,
      });
    }
  }
}
