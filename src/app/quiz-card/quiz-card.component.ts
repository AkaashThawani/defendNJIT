import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [CommonModule,MatButtonModule],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.scss'
})
export class QuizCardComponent {
  @Input() question: string = '';
  @Input() options: string[] = [];
  @Input() correctAnswer: string = '';
  selectedOption: string = '';

  selectOption(option: string) {
    this.selectedOption = option;
    this.checkAnswer(this.selectedOption);
  }

  checkAnswer(ans): boolean {
    return ans === this.correctAnswer;
  }
}
