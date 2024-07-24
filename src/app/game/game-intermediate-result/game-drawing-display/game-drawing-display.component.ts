import { TranslatePipe } from '@/app/core/translation.pipe';
import { Component, Input, OnInit } from '@angular/core';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-game-drawing-display',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-drawing-display.component.html',
  styleUrl: './game-drawing-display.component.scss',
})
export class GameDrawingDisplayComponent implements OnInit {
  @Input() drawingURL: string | undefined;
  results = this.drawingService.lastResult;
  secondsUsed = 0;
  hasCorrectGuess = false;
  roundScore = 0;

  constructor(private drawingService: DrawingService) {}

  ngOnInit(): void {
    this.secondsUsed = this.drawingService.getSecondsUsed();
    this.hasCorrectGuess = this.results.hasWon;
    this.roundScore = this.results.score;

    this.drawingService.resetSecondsUsed();
  }

  correctGuess = true;
  incorrectGuess = false;
  correctClassName = 'correct';
  incorrectClassName = 'incorrect';

  getRoundScoreText(): string {
    if (!this.roundScore) return '0';

    if (this.roundScore > 0) {
      return `+${this.roundScore}`;
    }
    return this.roundScore.toString();
  }

  getFeedbackStyle(): string {
    switch (this.hasCorrectGuess) {
      case this.correctGuess:
        return this.correctClassName;
      case this.incorrectGuess:
        return this.incorrectClassName;
      default:
        return '';
    }
  }

  pointsColorStyle(): string {
    // returns a css style class on correct guess
    if (this.hasCorrectGuess) {
      return 'green-text';
    }
    return 'red-text';
  }
}
