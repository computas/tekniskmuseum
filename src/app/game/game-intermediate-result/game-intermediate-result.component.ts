import { Component, OnInit, OnDestroy, output } from '@angular/core';
import { GAMESTATE, Result } from '../../shared/models/interfaces';
import { DrawingService } from '../services/drawing.service';
import { MultiplayerService } from '../services/multiplayer.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { GameConfigService } from '../services/game-config.service';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameDrawingFeedbackComponent } from './game-drawing-feedback/game-drawing-feedback.component';
import { GameDrawingDisplayComponent } from './game-drawing-display/game-drawing-display.component';
import { GameIntermediateResultHeaderComponent } from './game-intermediate-result-header/game-intermediate-result-header.component';
import { GameIntermediateResultFooterComponent } from './game-intermediate-result-footer/game-intermediate-result-footer.component';
import { GameStateService } from '../services/game-state-service';
@Component({
  selector: 'app-game-intermediate-result',
  templateUrl: './game-intermediate-result.component.html',
  styleUrls: ['./game-intermediate-result.component.scss'],
  standalone: true,
  imports: [
    TranslatePipe,
    GameDrawingFeedbackComponent,
    GameDrawingDisplayComponent,
    GameIntermediateResultComponent,
    GameIntermediateResultHeaderComponent,
    GameIntermediateResultFooterComponent,
  ],
})
export class GameIntermediateResultComponent implements OnInit, OnDestroy {
  result: Result | undefined;
  gameOver = false;
  waitingForPlayer = true;
  isMultiplayer = false;
  isSinglePlayer = false;

  config = this.gameConfigService.getConfig;

  constructor(
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.gameStateService.goToPage(GAMESTATE.intermediateResult);
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
            gameState: GAMESTATE.waitingForWord,
          };
        }
      });
      this.gameOver = this.drawingService.results.length === this.config.rounds;

      if (this.gameOver) {
        const totalScore: number = this.drawingService.results.reduce((accumulator: number, currentValue: Result) => {
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

  nextPage(nextGameState: GAMESTATE) {
    switch (nextGameState) {
      case GAMESTATE.showResult:
        this.getSummary();
        break;
      case GAMESTATE.showWord:
        this.newDrawing();
        break;
    }
  }

  newDrawing() {
    if (this.multiplayerService.isMultiplayer && this.multiplayerService.stateInfo.ready) {
      this.multiplayerService.stateInfo = {
        ...this.multiplayerService.stateInfo,
        gameState: GAMESTATE.waitingForWord,
      };
    }
  }

  getSummary() {
    if (this.multiplayerService.isMultiplayer && this.gameOver) {
      this.multiplayerService.stateInfo = {
        ...this.multiplayerService.stateInfo,
        gameState: GAMESTATE.showResult,
      };
    }
  }
}
