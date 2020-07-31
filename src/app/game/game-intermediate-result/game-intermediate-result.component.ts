import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Result } from '../../shared/models/interfaces';
import { DrawingService } from '../game-draw/services/drawing.service';
import { MultiplayerService, GAMELEVEL } from '../game-multiplayer/services/multiplayer.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
@Component({
  selector: 'app-game-intermediate-result',
  templateUrl: './game-intermediate-result.component.html',
  styleUrls: ['./game-intermediate-result.component.scss'],
})
export class GameIntermediateResultComponent implements OnInit, OnDestroy {
  result: Result;
  wonSentence = 'Hurra, jeg klarte å gjette at du tegnet ';
  lostSentence = 'Beklager, jeg klarte ikke å gjette hva du tegnet';
  gameOver: boolean;
  @Output() nextGuess = new EventEmitter();
  @Output() finalResult = new EventEmitter();
  waitingForPlayer = true;
  isMultiplayer = false;
  isSinglePlayer = false;
  constructor(
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.result = this.drawingService.lastResult;
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
      this.gameOver = this.drawingService.gameOver;
      this.waitingForPlayer = false;
    }
    if (this.multiplayerService.isMultiplayer) {
      this.isMultiplayer = true;
      this.multiplayerService.stateInfo$.subscribe((res) => {
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
  ngOnDestroy() {
    if (this.isSinglePlayer) {
      this.drawingService.hasAddedSingleplayerResult = false;
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
}
