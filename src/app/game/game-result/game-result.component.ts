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

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
  standalone: true,
  imports: [MatCardImage, MatIcon, MatButton, TitleCasePipe, TranslatePipe, SpeechBubbleComponent],
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
  getHighscoreSubscription: Subscription | null = null;
  postHighscoreSubscription: Subscription | null = null;

  IState = 'hidden';
  OState = 'hidden';

  CustomColorsIO = CustomColorsIO;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  titleText = 'Bra jobba! Du og O er et bra team';

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
          if (this.multiplayerService.stateInfo.score) {
            this.opponentScore = val.score;
            this.hasWon = this.multiplayerService.stateInfo.score >= val.score;
            this.score = this.multiplayerService.stateInfo.score;
          } else {
            this.hasWon = false;
          }
        }
      });

      this.multiplayerService.postScore(this.drawingService.playerid);
      this.getHighscoreSubscription = this.multiplayerService.getHighscore().subscribe({
        next: (highscoreData: HighscoreData) => {
          const todaysScores = highscoreData.daily.map((daily) => daily.score);
          if (Math.max(...todaysScores) > 0) {
            this.todaysHighscore = Math.max(...todaysScores);
          }
          if (
            this.drawingService.totalScore >= this.todaysHighscore &&
            this.drawingService.totalScore >= this.opponentScore
          ) {
            this.newHighscore = true;
          }
        },
        error: (error) => console.error("Error fetching today's highscore", error),
      });
    } else {
      this.score = this.drawingService.totalScore;
      this.postHighscoreSubscription = this.drawingService.postScore().subscribe();
      this.getHighscoreSubscription = this.drawingService.getHighscore().subscribe({
        next: (data) => {
          const todaysScores = data.daily.map((daily) => daily.score);
          if (Math.max(...todaysScores) > 0) {
            this.todaysHighscore = Math.max(...todaysScores);
          }
          if (this.drawingService.totalScore >= this.todaysHighscore) {
            this.newHighscore = true;
          }
        },
        error: (error) => console.error("Error fetching today's highscore", error),
      });
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
  ngOnDestroy(): void {
    this.getHighscoreSubscription?.unsubscribe();
    this.postHighscoreSubscription?.unsubscribe();
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
