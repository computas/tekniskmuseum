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
  gameOver: boolean;
  @Output() nextGuess = new EventEmitter();
  @Output() finalResult = new EventEmitter();

  constructor(private drawingService: DrawingService, private speechService: SpeechService) { }

  ngOnInit(): void {
    this.result = this.drawingService.lastResult;
    this.gameOver = this.drawingService.gameOver;

    console.log("ord", this.result.word);
  }

  newDrawing() {
    this.nextGuess.next(true);
  }

  getSummary() {
    this.finalResult.next(true);
  }

  speakResult() {
    if (this.result.hasWon) {
      this.speechService.speak(`${SPEECH.resultWon}${this.result.word}`);
    } else {
      this.speechService.speak(SPEECH.resultLoss);
    }
  }
}
