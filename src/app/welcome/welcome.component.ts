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
import { GAMESTATE, SupportedLanguages } from '../shared/models/interfaces';
import { SpeechBubbleComponent } from '../game/speech-bubble/speech-bubble.component';
import { GameStateService } from '../game/services/game-state-service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButton, MatIcon, TranslatePipe, CommonModule, SpeechBubbleComponent],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private headerClicks = 0;
  currentLang$: Observable<string>;
  private destroy$ = new Subject<void>();

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
