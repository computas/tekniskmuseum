import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Result } from '../../shared/models/result.interface';
import { DrawingService } from '../game-draw/services/drawing.service';
import { SPEECH } from 'src/app/shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';
import { MultiplayerService, GAMELEVEL } from 'src/app/multiplayer/services/multiplayer.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
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
  waitingForPlayer = true;
  isMultiplayer = false;
  isSinglePlayer = false;
  constructor(
    private drawingService: DrawingService,
    private speechService: SpeechService,
    private multiplayerService: MultiplayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.result = this.drawingService.lastResult;
    this.gameOver = this.drawingService.gameOver;
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    }
    if (this.multiplayerService.isMultiplayer) {
      this.isMultiplayer = true;
      this.multiplayerService.stateInfo$.subscribe((res) => {
        console.log(res);
        if (res.ready) {
          this.waitingForPlayer = false;
        }
      });
      this.multiplayerService.getLabel(false).subscribe((res) => {
        if (res) {
          this.multiplayerService.stateInfo = {
            ...this.multiplayerService.stateInfo,
            gameLevel: GAMELEVEL.waitingForWord,
          };
        }
      });
      this.gameOver = this.drawingService.results.length === this.drawingService.totalGuess;

      if (this.gameOver) {
        const totalScore: any = this.drawingService.results.reduce((accumulator: any, currentValue: any) => {
          return accumulator + currentValue.score;
        }, 0);
        this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, score: totalScore };
        this.multiplayerService.endGame(totalScore);
      }
    }
  }

  newDrawing() {
    if (this.multiplayerService.isMultiplayer && this.multiplayerService.stateInfo.ready) {
      this.multiplayerService.stateInfo = {
        ...this.multiplayerService.stateInfo,
        gameLevel: GAMELEVEL.waitingForWord,
      };
    } else {
      this.nextGuess.next(true);
    }
  }

  getSummary() {
    if (this.multiplayerService.isMultiplayer && this.gameOver) {
      this.multiplayerService.stateInfo = {
        ...this.multiplayerService.stateInfo,
        gameLevel: GAMELEVEL.showResult,
      };
    } else {
      this.finalResult.next(true);
    }
  }

  speakResult() {
    if (this.result.hasWon) {
      this.speechService.speak(`${SPEECH.resultWon}`);
    } else {
      this.speechService.speak(SPEECH.resultLoss);
    }
  }
}
