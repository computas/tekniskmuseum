import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../../../services/drawing.service';
import { TranslatePipe } from '@/app/core/translation.pipe';

@Component({
  selector: 'app-game-progress-bar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-progress-bar.component.html',
  styleUrl: './game-progress-bar.component.scss',
})
export class GameProgressBarComponent implements OnInit {
  roundNumberProgress = '';

  constructor(private drawingService: DrawingService) {}

  ngOnInit(): void {
    this.roundNumberProgress = this.getRoundProgressText();
  }

  getRoundProgressText(): string {
    // -1, because guessUsed starts at 1 and gets incremented before round summary
    const currentRoundNumber = this.drawingService.guessUsed - 1;
    const numberOfRounds = this.drawingService.config.rounds;
    return `${currentRoundNumber} / ${numberOfRounds}`;
  }
}
