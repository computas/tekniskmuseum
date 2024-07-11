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
import { SpeechBubbleComponent } from '../../game/speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '../../shared/customColors';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-game-pick-difficulty',
  templateUrl: './game-pick-difficulty.component.html',
  styleUrl: './game-pick-difficulty.component.scss',
  standalone: true,
  imports: [NgIf, MatIcon, MatButton, TranslatePipe, SpeechBubbleComponent],
  animations: [
    trigger('show', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', [animate('800ms')]),
    ]),
  ],
})
export class GamePickDifficultyComponent implements OnInit {
  config = this.gameConfigService.getConfig;

  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;

  stateFigureI = 'hidden';
  stateFigureO = 'hidden';
  stateFirstBubbleI = 'hidden';
  stateFirstBubbleO = 'hidden';
  stateButtons = 'hidden';

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

    this.startAnimation();
  }

  startAnimation() {
    setTimeout(() => {
      this.stateFirstBubbleO = 'visible';
      this.stateFigureO = 'visible';
    }, 500);
    setTimeout(() => {
      this.stateFirstBubbleI = 'visible';
      this.stateFigureI = 'visible';
      this.stateButtons = 'visible';
    }, 2000);
  }

  startDrawing(difficulty: 'easy' | 'medium' | 'hard') {
    this.gameConfigService.setDifficultyLevel(difficulty);
    this.gameStateService.startGame();
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }
}
