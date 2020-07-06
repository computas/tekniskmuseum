import { Component, OnInit, Input } from '@angular/core';
import { Highscore } from 'src/app/services/highscore.service';

@Component({
  selector: 'app-highscore-side-nav',
  templateUrl: './highscore-side-nav.component.html',
  styleUrls: ['./highscore-side-nav.component.scss'],
})
export class HighscoreSideNavComponent implements OnInit {
  @Input()
  highscores: Highscore;

  constructor() {}

  ngOnInit(): void {}
}
