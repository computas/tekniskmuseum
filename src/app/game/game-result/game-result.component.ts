import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';
import { Result } from '../../shared/models/result.interface';
import { Highscore, HighScoreService } from 'src/app/services/highscore.service';
import { Entry } from 'src/app/services/highscore-entry.interface';
import { Router } from '@angular/router';
import { MultiplayerService } from 'src/app/multiplayer/services/multiplayer.service';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
})
export class GameResultComponent implements OnInit {
  results: Result[] = [];
  dailyHighScores: Highscore[];
  totalScore: number;
  loading: boolean;
  value = '';
  constructor(
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.multiplayerService.isMultiplayer) {
      const totalScore = this.drawingService.results.reduce((accumulator: any, currentValue: any) => {
        return accumulator.score + currentValue.score;
      });
      console.log('totalScore', totalScore);
    }

    if (this.router.url === '/summary') {
      this.results = this.drawingService.get();
    } else {
      this.results = this.drawingService.results;
    }
  }
}
