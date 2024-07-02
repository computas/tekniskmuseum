import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../game/game-multiplayer/services/multiplayer.service';
import { DrawingService } from '../game/game-draw/services/drawing.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translation.pipe';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        MatButton,
        MatIcon,
        TranslatePipe,
        CommonModule
    ],
})
export class WelcomeComponent implements OnInit {
  private headerClicks = 0;
  currentLang$: Observable<string>;
  private destroy$ = new Subject<void>();
  
  constructor(
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.currentLang$ = this.translationService.lang$
  }

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
    const savedLanguage = localStorage.getItem('language') || 'NO';
    console.log(`Initializing with language ${savedLanguage}`);                      //SLETT MEG SENERE
    //this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
    this.translationService.loadTranslations(savedLanguage).pipe(takeUntil(this.destroy$)).subscribe();
  }

  goToAdmin() {
    this.headerClicks++;
    if (this.headerClicks === 7) {
      this.headerClicks = 0;
      this.router.navigate(['admin/info']);
    }
  }

  changeLanguage(lang: string) {
    console.log(`Changing language to ${lang} from welcome page`);                      //SLETT MEG SENERE
    //this.translationService.loadTranslations(lang).subscribe();
    this.translationService.changeLanguage(lang);
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
