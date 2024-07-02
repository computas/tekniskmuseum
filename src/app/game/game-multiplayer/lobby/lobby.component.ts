import { Component, OnInit, OnDestroy } from '@angular/core';
import { MultiplayerService } from '../services/multiplayer.service';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslationService } from '@/app/services/translation.service';
import { TranslatePipe } from '@/app/pipes/translation.pipe';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinner, 
    MatIcon, RouterLink, 
    RouterLinkActive, 
    MatButton,
    TranslatePipe
  ],
})
export class LobbyComponent implements OnInit, OnDestroy {
  waitingForOtherPlayer = true;
  subscriptions = new Subscription();

  constructor(
    public multiPlayerService: MultiplayerService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.multiPlayerService.joinGame(2).subscribe());
    this.subscriptions.add(
      this.multiPlayerService.stateInfo$.subscribe((obs) => {
        if (obs.ready) {
          this.waitingForOtherPlayer = false;
        }
      })
    );
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
