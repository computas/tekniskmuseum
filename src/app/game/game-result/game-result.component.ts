import { Component, OnInit, OnDestroy } from '@angular/core';
import { DrawingService } from '../services/drawing.service';
import { Result } from '../../shared/models/interfaces';
import { Router } from '@angular/router';
import { MultiplayerService } from '../services/multiplayer.service';
import { MatButton } from '@angular/material/button';
import { MatCardImage } from '@angular/material/card';
import { TitleCasePipe } from '@angular/common';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { Subscription } from 'rxjs';
import { GameStateService } from '../services/game-state-service';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
  standalone: true,
  imports: [MatCardImage, MatButton, TitleCasePipe, TranslatePipe],
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
  newHighscore = false;
  getHighscoreSubscription: Subscription | null = null;
  postHighscoreSubscription: Subscription | null = null;
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
            this.hasWon = this.multiplayerService.stateInfo.score >= val.score;
            this.score = this.multiplayerService.stateInfo.score;
          } else {
            this.hasWon = false;
          }
        }
      });
    } else {
      this.score = this.drawingService.totalScore;
    }

    this.getHighscoreSubscription = this.drawingService.getHighscore().subscribe({
      next: (data) => {
        const todaysScores = data.daily.map((daily) => daily.score);
        if (Math.max(...todaysScores) > 0) {
          this.todaysHighscore = Math.max(...todaysScores);
        }
        if (this.drawingService.totalScore > this.todaysHighscore) {
          this.newHighscore = true;
        }
      },
      error: (error) => console.error("Error fetching today's highscore", error),
    });

    this.postHighscoreSubscription = this.drawingService.postScore().subscribe();

    if (this.router.url === '/summary') {
      this.results = this.drawingService.get();
    } else if (this.router.url === '/summary/multiplayer') {
      this.ismultiplayer = true;
      this.hasWon = true;
      this.results = this.drawingService.get();
    } else {
      this.results = this.drawingService.results;
    }
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }
  ngOnDestroy(): void {
    this.getHighscoreSubscription?.unsubscribe();
    this.postHighscoreSubscription?.unsubscribe();
  }
}
