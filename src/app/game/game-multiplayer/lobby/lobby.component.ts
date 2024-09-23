import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MultiplayerService } from '../../services/multiplayer.service';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameStateService } from '../../services/game-state-service';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '@/app/shared/customColors';
import { PointerSide, ArrowAlignment } from '@/app/shared/models/interfaces';
import { IAvatarComponent } from '@/assets/avatars/i-avatar/i-avatar.component';
import { CustomButtonComponent } from '../../shared-components/custom-button/custom-button.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatButton,
    TranslatePipe,
    SpeechBubbleComponent,
    IAvatarComponent,
    CustomButtonComponent,
  ],
})
export class LobbyComponent implements OnInit, OnDestroy {
  @Input() initializeComponent?: () => void;
  waitingForOtherPlayer = true;
  subscriptions = new Subscription();

  // Speech Bubble imports
  CustomColorsIO = CustomColorsIO;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;

  // Setting the colors of I
  colorOfI = CustomColorsIO.white;
  bubbleColorI = CustomColorsIO.purple;
  textColorI = CustomColorsIO.white;

  // Setting button style
  buttonStyleClass = ButtonStyleClass.back;

  constructor(
    private gameStateService: GameStateService,
    public multiPlayerService: MultiplayerService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    const difficulty = 2; // Difficulty set to medium (1 for easy, 3 for hard)
    this.subscriptions.add(this.multiPlayerService.joinGame(difficulty).subscribe());
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
