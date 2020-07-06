import { Component, OnInit } from '@angular/core';
import { Highscore, HighScoreService } from '../services/highscore.service';
@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss'],
})
export class HighScoreComponent implements OnInit {
  highscores: Highscore[];
  constructor(private highscoreService: HighScoreService) {}

  ngOnInit(): void {
    this.highscoreService.get().subscribe((res) => {
      this.highscores = res;
    });
  }
}
