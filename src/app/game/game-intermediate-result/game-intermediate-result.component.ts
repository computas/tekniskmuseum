import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Result } from '../../shared/models/interfaces';
import { DrawingService } from '../game-draw/services/drawing.service';
import { MultiplayerService, GAMELEVEL } from '../game-multiplayer/services/multiplayer.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { UpperCasePipe } from '@angular/common';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
@Component({
  selector: 'app-game-intermediate-result',
  templateUrl: './game-intermediate-result.component.html',
  styleUrls: ['./game-intermediate-result.component.scss'],
  standalone: true,
  imports: [
    MatButton, 
    MatProgressSpinner, 
    UpperCasePipe,
    TranslatePipe
  ],
})
export class GameIntermediateResultComponent implements OnInit, OnDestroy {
  result: Result | undefined;
  gameOver = false;
  @Output() nextGuess = new EventEmitter();
  @Output() finalResult = new EventEmitter();
  waitingForPlayer = true;
  isMultiplayer = false;
  isSinglePlayer = false;
  constructor(
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router,
    private translationService: TranslationService
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
        this.multiplayerService.endGame();
      }
    }
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
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
