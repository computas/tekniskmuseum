import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { CustomButtonComponent } from '../custom-button/custom-button.component';

@Component({
  selector: 'app-game-pick-difficulty',
  templateUrl: './game-pick-difficulty.component.html',
  styleUrl: './game-pick-difficulty.component.scss',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    MatButton,
    TranslatePipe,
    SpeechBubbleComponent,
    RouterLink,
    RouterLinkActive,
    CustomButtonComponent,
  ],
  animations: [
    trigger('show', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', [animate('0.3s')]),
    ]),
  ],
})
export class GamePickDifficultyComponent implements OnInit {
  config = this.gameConfigService.getConfig;
  private animationTimeouts: NodeJS.Timeout[] = [];

  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;

  buttonStyleClass = ButtonStyleClass.select;

  stateFigureI = 'hidden';
  stateFigureO = 'hidden';
  stateFirstBubbleI = 'hidden';
  stateFirstBubbleO = 'hidden';
  stateButtons = 'hidden';
  buttonsAreDisabled = true;

  homeButtonStyleClass = ButtonStyleClass.back;

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
    const steps = [
      {
        delay: 500,
        action: () => {
          this.stateFigureO = 'visible';
        },
      },
      {
        delay: 350,
        action: () => {
          this.stateFirstBubbleO = 'visible';
        },
      },
      {
        delay: 750,
        action: () => {
          this.stateFigureI = 'visible';
        },
      },
      {
        delay: 350,
        action: () => {
          this.stateButtons = 'visible';
          this.buttonsAreDisabled = false;
          this.stateFirstBubbleI = 'visible';
        },
      },
    ];
    let totalDelay = 0;
    steps.forEach((step) => {
      totalDelay += step.delay;
      const timeout = setTimeout(step.action, totalDelay);
      this.animationTimeouts.push(timeout);
    });
  }

  skipAnimation() {
    this.animationTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.animationTimeouts = [];

    this.stateFirstBubbleO = 'visible';
    this.stateFirstBubbleI = 'visible';
    this.stateFigureI = 'visible';
    this.stateFigureO = 'visible';
    this.stateButtons = 'visible';
    this.buttonsAreDisabled = false;
  }

  startDrawing(difficulty: 'easy' | 'medium' | 'hard') {
    this.gameConfigService.setDifficultyLevel(difficulty);
    this.gameStateService.startGame();
  }

  goToLanding() {
    this.router.navigate([routes.LANDING]);
  }

  goToWelcomePage() {
    this.router.navigate(['/welcome']);
  }
}
