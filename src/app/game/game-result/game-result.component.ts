import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';
import { Result } from '../../shared/models/result.interface';
import { HighScoreService } from 'src/app/services/highscore.service';
import { Entry } from 'src/app/services/highscore-entry.interface';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
})
export class GameResultComponent implements OnInit {
  results: Result[] = [];
  constructor(private drawingService: DrawingService, private highScoreService: HighScoreService) {}

  ngOnInit(): void {
    this.highScoreService.getAllHighScores().subscribe((res) => {});
    this.results = this.drawingService.results;
    this.highScoreService.submitHighScore$.subscribe((res) => {
      if (res.submit) {
        const entry: Entry = {
          name: res.name,
          token: this.drawingService.token,
        };
        this.highScoreService.endGame(entry).subscribe((response) => {});
      }
    });
  }
  submitHighScore() {}
}
