import { Component } from '@angular/core';
import { GameProgressBarComponent } from '../game-progress-bar/game-progress-bar.component';

@Component({
  selector: 'app-game-intermediate-result-header',
  standalone: true,
  imports: [GameProgressBarComponent],
  templateUrl: './game-intermediate-result-header.component.html',
  styleUrl: './game-intermediate-result-header.component.scss',
})
export class GameIntermediateResultHeaderComponent {}
