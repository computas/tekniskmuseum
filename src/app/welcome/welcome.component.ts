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
import { SupportedLanguages } from '../shared/models/interfaces';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { SpeechBubbleComponent } from '../game/speech-bubble/speech-bubble.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButton, MatIcon, TranslatePipe, CommonModule, SpeechBubbleComponent],
  animations: [
    trigger('moveFigure', [
      state('hidden', style({opacity: 0})),
      state('visible', style({opacity: 1 })),
      state('moved', style({ transform: 'translateY(228px)' })),
      transition('hidden => visible', [animate('1s')]),
      transition('visible => moved', [animate('1s')]),
    ]),
    trigger('showBubble', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', [animate('1s')])
    ])
  ],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private headerClicks = 0;
  currentLang$: Observable<string>;
  private destroy$ = new Subject<void>();
  stateFigureI = 'hidden';
  stateFigureO = 'hidden';
  stateFirstBubbleI = 'hidden'
  stateSecondBubbleI = 'hidden'
  stateFirstBubbleO = 'hidden'
  stateSecondBubbleO = 'hidden'
  stateButton = 'hidden'

  constructor(
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.currentLang$ = this.translationService.lang$;
  }

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
    const savedLanguage = (localStorage.getItem('language') as SupportedLanguages) || 'NO';
    
    this.translationService
      .loadTranslations(savedLanguage)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.translationService.setLanguage(savedLanguage);
      });
      this.startAnimation();
  }

  goToAdmin() {
    this.headerClicks++;
    if (this.headerClicks === 7) {
      this.headerClicks = 0;
      this.router.navigate(['admin/info']);
    }
  }

  changeLanguage(lang: SupportedLanguages) {
    this.translationService.changeLanguage(lang);
  }


  startAnimation() {
    setTimeout(() => {
      this.stateFirstBubbleO = 'visible'
      this.stateFigureO = 'visible'
    }, 500);
    setTimeout(() => {
      this.stateFirstBubbleI = 'visible'
      this.stateFigureI = 'visible'
    }, 2000);
    setTimeout(() => {
      this.stateSecondBubbleO = 'visible'
      this.stateFigureO = 'moved'
    }, 4000);
    setTimeout(() => {
      this.stateSecondBubbleI = 'visible'
      this.stateFigureI = 'moved'
      this.stateButton = 'visible'
    }, 7000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
