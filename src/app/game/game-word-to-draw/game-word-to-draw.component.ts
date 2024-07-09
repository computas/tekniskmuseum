import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DrawingService } from '../services/drawing.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService } from '../services/multiplayer.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UpperCasePipe } from '@angular/common';
import { GameConfigService } from '../services/game-config.service';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GAMESTATE } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';

@Component({
  selector: 'app-game-word-to-draw',
  templateUrl: './game-word-to-draw.component.html',
  styleUrls: ['./game-word-to-draw.component.scss'],
  standalone: true,
  imports: [MatProgressSpinner, MatButton, MatIcon, UpperCasePipe, TranslatePipe],
})
export class GameWordToDrawComponent implements OnInit, OnDestroy {
  config = this.gameConfigService.getConfig;

  isSinglePlayer = false;
  isMultiPlayer = false;
  playernr = '';
  totalRounds = this.config.rounds;
  guessUsed = 1;
  timeLeft = 5;

  loading = true;

  word = '';

  subscriptions = new Subscription();
  timerSubscription: Subscription | undefined;

  constructor(
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.gameStateService.savePageToLocalStorage(GAMESTATE.showWord);
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
    }
    if (this.isSinglePlayer) {
      if (this.drawingService.gameHasStarted) {
        this.subscriptions.add(
          this.drawingService.getLabel().subscribe((res) => {
            this.word = res.label;
            this.loading = false;
          })
        );
        this.subscriptions.add(
          this.drawingService.guessUsed$.subscribe((res) => {
            this.guessUsed = res;
          })
        );
      } else {
        this.subscriptions.add(
          this.drawingService.startGame().subscribe(() => {
            this.loading = false;
            this.word = this.drawingService.label;
            this.drawingService.gameHasStarted = true;
          })
        );
        this.subscriptions.add(
          this.drawingService.guessUsed$.subscribe((res) => {
            this.guessUsed = res;
          })
        );
      }
    }
    if (this.gameStateService.isMultiplayer()) {
      const player = this.multiplayerService.stateInfo.player_nr;
      this.playernr = player === 'player_1' ? '1' : '2';
      this.guessUsed = this.drawingService.guessUsed;
      this.subscriptions.add(
        this.multiplayerService.getLabel().subscribe((label) => {
          if (label) {
            this.multiplayerService.stateInfo = {
              ...this.multiplayerService.stateInfo,
              label,
            };
            this.word = label;
            this.loading = false;
            this.subscriptions.add(this.startTimer().subscribe());
          }
        })
      );
    }
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  toDrawingBoard() {
    this.gameStateService.goToPage(GAMESTATE.drawingBoard);
  }

  startTimer() {
    return interval(1000)
      .pipe(take(5))
      .pipe(
        tap(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, gameState: GAMESTATE.drawing };
            this.toDrawingBoard();
          }
        })
      );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
