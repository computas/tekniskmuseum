import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from '../../shared/models/routes';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { GameConfigService } from '../services/game-config.service';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameLevelConfig, GAMESTATE } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';

@Component({
  selector: 'app-game-pick-difficulty',
  templateUrl: './game-pick-difficulty.component.html',
  styleUrl: './game-pick-difficulty.component.scss',
  standalone: true,
  imports: [NgIf, MatIcon, MatButton, TranslatePipe],
})
export class GamePickDifficultyComponent implements OnInit {
  config = this.gameConfigService.getConfig;

  constructor(
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.gameStateService.savePageToLocalStorage(GAMESTATE.difficultyPicker);
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();

    this.gameConfigService.difficultyLevel$.subscribe((config: GameLevelConfig) => {
      this.config = config;
    });
  }

  startDrawing(difficulty: 'easy' | 'medium' | 'hard') {
    this.gameConfigService.setDifficultyLevel(difficulty);
    this.gameStateService.startGame();
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }
}
