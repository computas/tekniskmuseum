import { Component, OnInit } from '@angular/core';
import { SpeechBubbleComponent } from '../../shared-components/speech-bubble/speech-bubble.component';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { DrawingService } from '../../services/drawing.service';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { CorrectGuessComponent } from './correct-guess/correct-guess.component';
import { WrongGuessComponent } from './wrong-guess/wrong-guess.component';

@Component({
  selector: 'app-game-example-drawings',
  standalone: true,
  imports: [SpeechBubbleComponent, TranslatePipe, OAvatarComponent, CorrectGuessComponent, WrongGuessComponent],
  templateUrl: './game-example-drawings.component.html',
  styleUrl: './game-example-drawings.component.scss',
})
export class GameExampleDrawingsComponent implements OnInit {
  hasCorrectGuess = false;
  constructor(private drawingService: DrawingService) {}
  ngOnInit(): void {
    this.hasCorrectGuess = this.drawingService.lastResult.hasWon;
  }
}
