import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';
import { Result } from '../../shared/models/result.interface';
import { Highscore } from 'src/app/services/highscore.service';
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
  hasWon: boolean;
  ismultiplayer = false;
  constructor(
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.multiplayerService.isMultiplayer) {
      this.ismultiplayer = true;
      this.multiplayerService._oppentScore.subscribe((val) => {
        if (val && val.score) {
          if (typeof this.multiplayerService.stateInfo.score === 'undefined') {
            this.hasWon = false;
          } else {
            this.hasWon = this.multiplayerService.stateInfo.score >= val.score;
          }
        }
        console.log('oppnent score from result', val);
      });
    }

    if (this.router.url === '/summary') {
      this.results = this.drawingService.get();
    } else {
      this.results = this.drawingService.results;
    }
  }
}
