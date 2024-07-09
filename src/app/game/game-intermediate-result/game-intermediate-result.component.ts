import { Component, OnInit, OnDestroy } from '@angular/core';
import { GAMESTATE, Result } from '../../shared/models/interfaces';
import { DrawingService } from '../services/drawing.service';
import { MultiplayerService } from '../services/multiplayer.service';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameDrawingFeedbackComponent } from './game-drawing-feedback/game-drawing-feedback.component';
import { GameDrawingDisplayComponent } from './game-drawing-display/game-drawing-display.component';
import { GameIntermediateResultHeaderComponent } from './game-intermediate-result-header/game-intermediate-result-header.component';
import { GameExampleDrawingsComponent } from './game-example-drawings/game-example-drawings.component';
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
    GameExampleDrawingsComponent,
    GameIntermediateResultFooterComponent,
  ],
})
export class GameIntermediateResultComponent implements OnInit, OnDestroy {
  result: Result | undefined;

  constructor(
    private gameStateService: GameStateService,
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.gameStateService.savePageToLocalStorage(GAMESTATE.intermediateResult);
    this.result = this.drawingService.lastResult;
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();

    if (this.gameStateService.isSingleplayer()) return;

    this.multiplayerService.getLabel(false).subscribe((res) => {
      if (res) {
        this.gameStateService.nextRound();
      }
    });

    if (this.gameStateService.isGameOver()) {
      this.prepareMultiplayerEndResults();
    }
  }

  ngOnDestroy() {
    if (this.gameStateService.isSingleplayer()) {
      this.drawingService.hasAddedSingleplayerResult = false;
    }
  }

  prepareMultiplayerEndResults() {
    const totalScore: number = this.drawingService.results.reduce((accumulator: number, currentValue: Result) => {
      return accumulator + currentValue.score;
    }, 0);
    this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, score: totalScore };
    this.multiplayerService.endGame();
  }
}
