// toast.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.sass'],
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() duration: number = 3000;
  @Output() hidden = new EventEmitter<void>();
  visible: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.visible = false;
      this.hidden.emit();
    }, this.duration);
  }

  close(): void {
    this.visible = false;
    this.hidden.emit();
  }
}
