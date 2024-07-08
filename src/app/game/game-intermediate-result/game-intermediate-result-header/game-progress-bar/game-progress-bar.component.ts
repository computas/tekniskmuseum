import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../../../services/drawing.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameStateService } from '@/app/game/services/game-state-service';

@Component({
  selector: 'app-game-progress-bar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-progress-bar.component.html',
  styleUrl: './game-progress-bar.component.scss',
})
export class GameProgressBarComponent implements OnInit {
  roundNumberProgress = '';

  constructor(private drawingService: DrawingService, private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.roundNumberProgress = this.getRoundProgressText();
  }

  getRoundProgressText(): string {
    const currentRoundNumber = this.gameStateService.getCurrentRound();
    const numberOfRounds = this.drawingService.config.rounds;
    return `${currentRoundNumber} / ${numberOfRounds}`;
  }
}
