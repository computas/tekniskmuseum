import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../game-draw/services/drawing.service';
import { Result } from '../../shared/models/result.interface';
import { HighScoreService } from 'src/app/services/highscore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss'],
})
export class GameResultComponent implements OnInit {
  results: Result[] = [];
  constructor(
    private drawingService: DrawingService,
    private highScoreService: HighScoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.highScoreService.getAllHighScores().subscribe((res) => {});
    if (this.router.url === '/summary') {
      this.results = this.drawingService.get();
    } else {
      this.results = this.drawingService.results;
    }
  }
}
