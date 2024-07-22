import { TranslatePipe } from '@/app/core/translation.pipe';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { Component, Input, OnInit } from '@angular/core';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '../../../shared/customColors';
import { IAvatarComponent } from '@/assets/avatars/i-avatar/i-avatar.component';
import { DrawingService } from '../../services/drawing.service';

@Component({
  selector: 'app-game-drawing-feedback',
  standalone: true,
  imports: [TranslatePipe, SpeechBubbleComponent, IAvatarComponent],
  templateUrl: './game-drawing-feedback.component.html',
  styleUrl: './game-drawing-feedback.component.scss',
})
export class GameDrawingFeedbackComponent implements OnInit {
  @Input() hasCorrectGuess: boolean | undefined; // TODO check if it is possible to disregard undefined type for later
  feedbackTitleKey = '';
  feedbackDescriptionKey = '';
  correctGuess = true;
  failedGuess = false;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  label = '';

  constructor(private drawingService: DrawingService) {}

  ngOnInit(): void {
    this.setFeedbackText();
    this.label = this.drawingService.label;
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
    }
  }
}
