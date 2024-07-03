import { Component, OnInit } from '@angular/core';
import { DrawingService } from '../../../game-draw/services/drawing.service';
import { GameConfigService } from '../../../game-config.service';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';

@Component({
  selector: 'app-game-progress-bar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './game-progress-bar.component.html',
  styleUrl: './game-progress-bar.component.scss',
})
export class GameProgressBarComponent implements OnInit {
  roundNumberProgress = '';

  constructor(
    private gameConfigService: GameConfigService,
    private drawingService: DrawingService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.translationService.lang$.subscribe((lang) => {
      this.translationService.loadTranslations(lang).subscribe();
    });
    this.roundNumberProgress = this.getRoundProgressText();
  }

  getRoundProgressText(): string {
    const currentRoundNumber = this.drawingService.guessUsed;
    const numberOfRounds = this.gameConfigService.getConfig.rounds;
    return `${currentRoundNumber} / ${numberOfRounds}`;
  }
}
