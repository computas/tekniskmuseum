import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Result } from '../../shared/models/result.interface';
import { DrawingService } from '../game-draw/services/drawing.service';
import { SPEECH } from 'src/app/shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';
@Component({
  selector: 'app-game-intermediate-result',
  templateUrl: './game-intermediate-result.component.html',
  styleUrls: ['./game-intermediate-result.component.scss'],
})
export class GameIntermediateResultComponent implements OnInit {
  result: Result;
  wonSentence = SPEECH.resultWon;
  lostSentence = SPEECH.resultLoss;
  @Output() nextGuess = new EventEmitter();

  constructor(private drawingService: DrawingService, private speechService: SpeechService) {}

  ngOnInit(): void {
    this.result = this.drawingService.lastResult;
  }

  newDrawing() {
    this.nextGuess.next(true);
  }

  speakResult() {
    if (this.result.hasWon) {
      this.speechService.speak(`${SPEECH.resultWon}${this.result.word}`);
    } else {
      this.speechService.speak(SPEECH.resultLoss);
    }
  }
}
