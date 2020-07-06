import { Component, OnInit } from '@angular/core';
import { Highscore, HighscoreService } from '../services/highscore.service';
@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss'],
})
export class HighscoreComponent implements OnInit {
  highscores: Highscore[];
  constructor(private highscoreService: HighscoreService) {}

  ngOnInit(): void {
    this.highscoreService.get().subscribe((res) => {
      this.highscores = res;
    });
  }
}
