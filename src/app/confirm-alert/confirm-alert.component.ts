import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-alert.component.html',
  styleUrl: './confirm-alert.component.sass',
})
export class ConfirmAlertComponent {
  @Input() message: string = 'Are you sure?';
  @Input() isAlert = true;
  @Output() confirm = new EventEmitter<boolean>();

  onConfirm() {
    this.confirm.emit(true); // Emit true when confirmed
  }

  onCancel() {
    this.confirm.emit(false); // Emit false when cancelled
  }
}
