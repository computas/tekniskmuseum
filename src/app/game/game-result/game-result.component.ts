import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';
import { Result } from '../../shared/models/interfaces';
import { Router } from '@angular/router';
import { MultiplayerService } from '../game-multiplayer/services/multiplayer.service';
import { MatButton } from '@angular/material/button';
import { MatCardImage } from '@angular/material/card';
import { TitleCasePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
  standalone: true,
  imports: [MatCardImage, MatButton, TitleCasePipe],
})
export class GameResultComponent implements OnInit {
  results: Result[] = [];
  totalScore = 0;
  loading = false;
  value = '';
  hasWon = false;
  ismultiplayer = false;
  score = 0;
  todaysHighscore: number = 0;
  newHighscore: boolean = false;
  getHighscoreSubscription: Subscription | null = null;
  postHighscoreSubscription: Subscription | null = null;
  constructor(
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.multiplayerService.isMultiplayer) {
      this.ismultiplayer = true;
      this.multiplayerService._opponentScore.subscribe((val) => {
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
      this.score = this.drawingService.totalScore
    }

    this.getHighscoreSubscription = this.drawingService.getHighscore().subscribe({
      next: (data) => {
        const todaysScores = data.daily.map(daily=>daily.score);
        if (Math.max(...todaysScores) > 0) {
          this.todaysHighscore = Math.max(...todaysScores);
        }
        if (this.drawingService.totalScore > this.todaysHighscore) {
          this.newHighscore = true;
        }
      },
      error: (error) => console.error("Error fetching today's highscore", error)
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
  }
  ngOnDestroy(): void {
    this.getHighscoreSubscription?.unsubscribe();
    this.postHighscoreSubscription?.unsubscribe();
  }
}
