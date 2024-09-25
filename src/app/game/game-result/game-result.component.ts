import { Component, OnInit, OnDestroy } from '@angular/core';
import { DrawingService } from '../services/drawing.service';
import { ArrowAlignment, PointerSide, Result } from '../../shared/models/interfaces';
import { Router } from '@angular/router';
import { MultiplayerService } from '../services/multiplayer.service';
import { MatButton } from '@angular/material/button';
import { MatCardImage } from '@angular/material/card';
import { TitleCasePipe } from '@angular/common';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { Subscription } from 'rxjs';
import {
  trigger,
  style,
  animate,
  transition,
  state,
  // ...
} from '@angular/animations';
import { HighscoreData } from '@/app/shared/models/backend-interfaces';
import { SpeechBubbleComponent } from '../speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '@/app/shared/customColors';
import { MatIcon } from '@angular/material/icon';
import { GameStateService } from '../services/game-state-service';
import confetti from 'canvas-confetti';
import { confettiSettings, iConfettiFigure, oConfettiFigure } from '@/assets/avatars/confetti-config';
import { IAvatarComponent } from '@/assets/avatars/i-avatar/i-avatar.component';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { CustomButtonComponent } from '../shared-components/custom-button/custom-button.component';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
  standalone: true,
  imports: [
    MatCardImage,
    MatIcon,
    MatButton,
    TitleCasePipe,
    TranslatePipe,
    SpeechBubbleComponent,
    IAvatarComponent,
    OAvatarComponent,
    CustomButtonComponent,
  ],
  animations: [
    trigger('fadeIn', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', [animate('1.5s')]),
    ]),
  ],
})
export class GameResultComponent implements OnInit, OnDestroy {
  results: Result[] = [];
  totalScore = 0;
  loading = false;
  value = '';
  hasWon = false;
  ismultiplayer = false;
  score = 0;
  todaysHighscore = 0;
  opponentScore = 0;
  newHighscore = false;
  confettiDuration = 2 * 1000;
  confettiEndTime = Date.now() + this.confettiDuration;
  difficulty = 0;
  getHighscoreSubscription: Subscription | null = null;
  postHighscoreSubscription: Subscription | null = null;

  IState = 'hidden';
  OState = 'hidden';

  CustomColorsIO = CustomColorsIO;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;

  homeButtonStyleClass = ButtonStyleClass.end;
  playAgainButtonStyleClass = ButtonStyleClass.playAgain;

  constructor(
    private gameStateService: GameStateService,
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    if (this.gameStateService.isMultiplayer()) {
      this.ismultiplayer = true;
      this.multiplayerService.opponentScore.subscribe((val) => {
        if (val) {
          if (this.multiplayerService.stateInfo.score !== undefined) {
            this.opponentScore = val.score;
            this.hasWon = this.multiplayerService.stateInfo.score >= val.score;
            this.score = this.multiplayerService.stateInfo.score;
          } else {
            this.hasWon = false;
          }
        }
      });
      if (this.hasWon) {
        setTimeout(this.shootConfetti, 1000);
      }

      this.difficulty = this.gameStateService.getDifficulty();
      this.multiplayerService.postScore(this.drawingService.playerid);
      this.getHighscoreSubscription = this.multiplayerService
        .getHighscore()
        .subscribe((highscoreData: HighscoreData) => {
          const todaysScores = highscoreData.daily.map((daily) => daily.score);
          if (Math.max(...todaysScores) > 0) {
            this.todaysHighscore = Math.max(...todaysScores);
          }
          if (this.score >= this.todaysHighscore && this.score >= this.opponentScore && this.score > 0) {
            this.newHighscore = true;
          }
        });
    } else {
      this.score = this.drawingService.totalScore;
      this.difficulty = this.gameStateService.getDifficulty();
      this.postHighscoreSubscription = this.drawingService.postScore().subscribe();
      this.getHighscoreSubscription = this.drawingService.getHighscore().subscribe({
        next: (data) => {
          const todaysScores = data.daily.map((daily) => daily.score);
          if (Math.max(...todaysScores) > 0) {
            this.todaysHighscore = Math.max(...todaysScores);
          }
          if (this.drawingService.totalScore >= this.todaysHighscore && this.score > 0) {
            this.newHighscore = true;
            setTimeout(this.shootConfetti, 1000);
          }
        },
        error: (error) => console.error("Error fetching today's highscore", error),
      });
    }
    if (this.opponentScore > this.todaysHighscore) {
      this.todaysHighscore = this.opponentScore;
    }

    if (this.router.url === '/summary') {
      this.results = this.drawingService.get();
    } else if (this.router.url === '/summary/multiplayer') {
      this.ismultiplayer = true;
      this.hasWon = true;
      this.results = this.drawingService.get();
    } else {
      this.results = this.drawingService.results;
    }
    this.startAnimation();
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }
  shootConfetti(): void {
    confetti({
      ...confettiSettings,
      scalar: 5,
      angle: 60,
      origin: { x: 0, y: 0.8 },
      shapes: [iConfettiFigure],
    });
    confetti({
      ...confettiSettings,
      scalar: 3,
      angle: 120,
      origin: { x: 1, y: 0.8 },
      shapes: [oConfettiFigure],
    });
  }
  ngOnDestroy(): void {
    confetti.reset();
    this.getHighscoreSubscription?.unsubscribe();
    this.postHighscoreSubscription?.unsubscribe();
    this.multiplayerService.clearState();
  }

  playAgain(): void {
    if (this.ismultiplayer) {
      this.multiplayerService.clearState();
    }

    this.drawingService.clearState();
    this.gameStateService.restartGame();
  }

  endGame(): void {
    if (this.ismultiplayer) {
      this.multiplayerService.clearState();
    }
    this.gameStateService.endGame();
    this.router.navigate(['/welcome']);
  }

  startAnimation() {
    setTimeout(() => {
      this.IState = 'visible';
    }, 500);
    setTimeout(() => {
      this.OState = 'visible';
    }, 1500);
  }
}
