import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-drawing-display',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './game-drawing-display.component.html',
  styleUrl: './game-drawing-display.component.scss'
})
export class GameDrawingDisplayComponent {
  @Input() hasCorrectGuess: boolean | undefined;
  @Input() drawingURL: string | undefined;
  @Input() roundScore: number | undefined;

  correctGuess =        true
  incorrectGuess =      false
  correctClassName =    'correct';
  incorrectClassName =  'incorrect';

  getFeedbackStyle(): string {
    switch (this.hasCorrectGuess) {
      case this.correctGuess:
        return this.correctClassName;
      case this.incorrectGuess:
        return this.incorrectClassName;
      default:
        return ''
    }
  }
}
