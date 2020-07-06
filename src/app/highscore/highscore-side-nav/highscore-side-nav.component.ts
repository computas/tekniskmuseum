import { Component, OnInit, Input } from '@angular/core';
import { Highscore, HighScoreService } from 'src/app/services/highscore.service';

@Component({
  selector: 'app-highscore-side-nav',
  templateUrl: './highscore-side-nav.component.html',
  styleUrls: ['./highscore-side-nav.component.scss'],
})
export class HighScoreSideNavComponent implements OnInit {
  opened: boolean;
  highscores: Highscore[];
  value = '';
  @Input() playerScore: number;

  constructor(private highscoreService: HighScoreService) {}

  ngOnInit(): void {
    /*this.highscoreService.get().subscribe((res) => {
      this.highscores = res;
    });*/
    this.highscoreService.getHighScoresFiltered(this.playerScore).subscribe((res) => {
      this.highscores = res;
    });
  }
  click() {}
}
