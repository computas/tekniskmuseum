import { Component, OnInit, Input } from '@angular/core';
import { Highscore, HighScoreService } from 'src/app/services/highscore.service';

@Component({
  selector: 'app-highscore-side-nav',
  templateUrl: './highscore-side-nav.component.html',
  styleUrls: ['./highscore-side-nav.component.scss'],
})
export class HighScoreSideNavComponent implements OnInit {
  opened = true;
  highscores: Highscore[];
  totalHighScores: Highscore[];
  dailyHighScores: Highscore[];
  value = '';
  loading = true;
  hasSubmit = false;

  @Input()
  playerScore: number;
  constructor(private highscoreService: HighScoreService) {}

  ngOnInit(): void {
    /*this.highscoreService.get().subscribe((res) => {
      this.highscores = res;
    });*/
    this.highscoreService.getAllHighScores().subscribe((res) => {
      this.totalHighScores = res.total;
      this.loading = false;
      this.dailyHighScores = res.daily;
    });
    this.highscoreService.getHighScoresFiltered(this.playerScore).subscribe((res) => {
      this.highscores = res;
    });
  }

  click() {
    const player = this.highscoreService.findScoreOfNewUser();
    if (player) {
      player.name = this.value;
    }
    this.hasSubmit = true;
  }
}
