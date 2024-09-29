import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-instruction-modal',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './instruction-modal.component.html',
  styleUrl: './instruction-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InstructionModalComponent {
  constructor(public dialogRef: MatDialogRef<InstructionModalComponent>) { }
  @Output() playGame: EventEmitter<void> = new EventEmitter<void>();
  onPlayNow() {
    this.playGame.emit(); // Emit the playGame event
    this.dialogRef.close(); // Close the modal
  }
}
