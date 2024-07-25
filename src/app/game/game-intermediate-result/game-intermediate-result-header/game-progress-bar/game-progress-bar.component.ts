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
  currentRoundNumber = 0;
  totalRounds = 0;

  constructor(private drawingService: DrawingService, private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.currentRoundNumber = this.gameStateService.getCurrentRound();
    this.totalRounds = this.drawingService.config.rounds;
  }
}
