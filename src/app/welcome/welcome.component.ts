import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiplayerService } from '../game/services/multiplayer.service';
import { DrawingService } from '../game/services/drawing.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslationService } from '../core/translation.service';
import { TranslatePipe } from '../core/translation.pipe';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GAMESTATE } from '../shared/models/interfaces';
import { GameStateService } from '../game/services/game-state-service';
import { SupportedLanguages } from '../shared/models/interfaces';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SpeechBubbleComponent } from '../game/speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '../shared/customColors';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButton, MatIcon, TranslatePipe, CommonModule, SpeechBubbleComponent],

  animations: [
    trigger('moveFigure', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      state('anticipate', style({ transform: 'translateY(-20px)' })),
      state('break', style({ transform: 'translateY({{breakY}}px)' }), { params: { breakY: '0' } }),
      state('end', style({ transform: 'translateY({{y}}px)' }), { params: { y: '0' } }),
      transition('hidden => visible', [animate('0.7s')]),
      transition('visible => anticipate', [animate('0.4s')]),
      transition('anticipate => break', [animate('0.4s ease-in')]),
      transition('break => end', [animate('0.1s')]),
    ]),
    trigger('makeVisible', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('0.3s {{delay}}ms'), { params: { delay: 450 } }),
    ]),
  ],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  currentLang$: Observable<string>;
  private destroy$ = new Subject<void>();
  private animationTimeouts: NodeJS.Timeout[] = [];

  moveDistanceI = 125;
  moveDistanceO = 200;
  normalDelay = 350;

  stateFigureI = 'hidden';
  stateFigureO = 'hidden';
  stateFirstBubbleI = { value: 'hidden', params: { delay: 0 } };
  stateSecondBubbleI = { value: 'hidden', params: { delay: 0 } };
  stateFirstBubbleO = { value: 'hidden', params: { delay: 0 } };
  stateSecondBubbleO = { value: 'hidden', params: { delay: 0 } };
  stateButtons = { value: 'hidden', params: { delay: 0 } };
  buttonIsVisible = false;

  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;

  constructor(
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService,
    private router: Router,
    private translationService: TranslationService,
    private gameStateService: GameStateService
  ) {
    this.currentLang$ = this.translationService.lang$;
  }

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
    this.gameStateService.clearState();
    const savedLanguage = (localStorage.getItem('language') as SupportedLanguages) || 'NO';

    this.translationService
      .loadTranslations(savedLanguage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translationService.setLanguage(savedLanguage);
      });

    this.startAnimation();
  }

  changeLanguage(lang: SupportedLanguages) {
    this.translationService.changeLanguage(lang);
  }

  startAnimation() {
    const steps = [
      {
        delay: 500,
        action: () => {
          this.stateFirstBubbleO = { value: 'visible', params: { delay: this.normalDelay } };
          this.stateFigureO = 'visible';
        },
      },
      {
        delay: 1000,
        action: () => {
          this.stateFirstBubbleI = { value: 'visible', params: { delay: this.normalDelay } };
          this.stateFigureI = 'visible';
        },
      },
      {
        delay: 1000,
        action: () => {
          this.stateFigureO = 'anticipate';
        },
      },
      {
        delay: 100,
        action: () => {
          this.stateSecondBubbleO = { value: 'visible', params: { delay: this.normalDelay } };
          this.stateFigureO = 'break';
        },
      },
      {
        delay: 450,
        action: () => {
          this.stateFigureO = 'end';
        },
      },
      {
        delay: 1000,
        action: () => {
          this.stateFigureI = 'anticipate';
        },
      },
      {
        delay: 100,
        action: () => {
          this.stateSecondBubbleI = { value: 'visible', params: { delay: this.normalDelay } };
          this.stateFigureI = 'break';
        },
      },
      {
        delay: 450,
        action: () => {
          this.stateFigureI = 'end';
          this.buttonIsVisible = true;
          this.stateButtons = { value: 'visible', params: { delay: this.normalDelay } };
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

    this.stateFirstBubbleO = { value: 'visible', params: { delay: 0 } };
    this.stateFirstBubbleI = { value: 'visible', params: { delay: 0 } };
    this.stateSecondBubbleI = { value: 'visible', params: { delay: 0 } };
    this.stateSecondBubbleO = { value: 'visible', params: { delay: 0 } };
    this.stateFigureI = 'end';
    this.stateFigureO = 'end';
    this.stateButtons = { value: 'visible', params: { delay: 0 } };
    this.buttonIsVisible = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setSingleplayer() {
    this.gameStateService.setSingleplayer();
    this.gameStateService.goToPage(GAMESTATE.howToPlay);
  }

  setMultiplayer() {
    this.gameStateService.setMultiplayer();
  }
}
