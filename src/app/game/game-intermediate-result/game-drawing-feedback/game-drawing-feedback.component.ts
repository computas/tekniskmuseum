import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-drawing-feedback',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-drawing-feedback.component.html',
  styleUrl: './game-drawing-feedback.component.scss',
})
export class GameDrawingFeedbackComponent implements OnInit {
  @Input() hasCorrectGuess: boolean | undefined; // TODO check if it is possible to disregard undefined type for later
  feedbackTitleKey = '';
  feedbackDescriptionKey = '';
  correctGuess = true;
  failedGuess = false;

  ngOnInit(): void {
    this.setFeedbackText();
  }

  setFeedbackText() {
    switch (this.hasCorrectGuess) {
      case this.failedGuess:
        this.feedbackTitleKey = 'ROUND_FEEDBACK_FAILED_TITLE';
        this.feedbackDescriptionKey = 'ROUND_FEEDBACK_FAILED_DESC_1';
        break;
      case this.correctGuess:
        this.feedbackTitleKey = 'ROUND_FEEDBACK_CORRECT_TITLE';
        this.feedbackDescriptionKey = 'ROUND_FEEDBACK_CORRECT_DESC_1';
        break;
      default:
      // TODO something went wrong text
    }
  }
}
