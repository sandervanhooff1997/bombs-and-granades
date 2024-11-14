import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormArray,
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
    playerNames: string[];
    maxScore: number;
  }>();
  gameTitle = 'Bombs & Granades';
  myForm!: FormGroup;
  maxScoreInput = 'maxScore';
  minPlayers = MIN_PLAYERS;
  maxPlayers = MAX_PLAYERS;
  minScore = MIN_SCORE_THRESHOLD;
  maxScore = MAX_SCORE_THRESHOLD;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.myForm = this.fb.group({
      players: this.fb.array(
        Array(this.minPlayers)
          .fill('')
          .map(() =>
            this.fb.control('', [Validators.required, Validators.maxLength(15)])
          )
      ),
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

  get players(): FormArray {
    return this.myForm.get('players') as FormArray;
  }

  addPlayer(): void {
    if (this.players.length < this.maxPlayers) {
      this.players.push(this.fb.control('', Validators.required));
    }
  }

  removePlayer(index: number): void {
    if (this.players.length > this.minPlayers) {
      this.players.removeAt(index);
    }
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.myForm.valid) {
      this.onGameStart.emit({
        playerNames: this.players.value,
        maxScore: this.myForm.get(this.maxScoreInput)?.value ?? 0,
      });
    }
  }
}
