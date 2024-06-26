import { Component, OnInit } from '@angular/core';
import { MultiplayerService } from '../game/game-multiplayer/services/multiplayer.service';
import { DrawingService } from '../game/game-draw/services/drawing.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translation.pipe';
import { HttpClient } from '@angular/common/http';

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
        TranslatePipe
    ],
    providers: [TranslationService, HttpClient]
})
export class WelcomeComponent implements OnInit {
  private headerClicks = 0;
  
  constructor(
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.multiplayerService.clearState();
    this.drawingService.clearState();
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  goToAdmin() {
    this.headerClicks++;
    if (this.headerClicks === 7) {
      this.headerClicks = 0;
      this.router.navigate(['admin/info']);
    }
  }

  changeLanguage(lang: string) {
    this.translationService.loadTranslations(lang).subscribe();
  }
}
