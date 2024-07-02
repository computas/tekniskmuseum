import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DrawingService } from '../game-draw/services/drawing.service';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MultiplayerService } from '../game-multiplayer/services/multiplayer.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UpperCasePipe } from '@angular/common';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';
import { GAMELEVEL } from '@/app/shared/models/interfaces';

@Component({
  selector: 'app-game-word-to-draw',
  templateUrl: './game-word-to-draw.component.html',
  styleUrls: ['./game-word-to-draw.component.scss'],
  standalone: true,
  imports: [MatProgressSpinner, MatButton, MatIcon, UpperCasePipe, TranslatePipe],
})
export class GameWordToDrawComponent implements OnInit, OnDestroy {
  constructor(
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  isSinglePlayer = false;
  isMultiPlayer = false;
  @Output() drawWord = new EventEmitter();
  word = '';
  guessUsed = 1;

  timeLeft = 5;

  loading = true;
  playernr = '';

  subscriptions = new Subscription();
  timerSubscription: Subscription | undefined;

  ngOnInit(): void {
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
    if (this.isMultiPlayer) {
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

  startTimer() {
    return interval(1000)
      .pipe(take(5))
      .pipe(
        tap(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, gameLevel: GAMELEVEL.drawing };
          }
        })
      );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
