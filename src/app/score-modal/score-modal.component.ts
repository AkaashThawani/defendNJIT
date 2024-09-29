// score-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-score-modal',
  imports: [MatButtonModule],
  templateUrl: './score-modal.component.html',
  styleUrls: ['./score-modal.component.scss'],
  standalone: true
})
export class ScoreModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ScoreModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { score: number }
  ) { }

  onPlayAgain() {
    this.dialogRef.close('playAgain');
  }

  onGoToLeaderboard() {
    this.dialogRef.close('leaderboard');
  }
}
