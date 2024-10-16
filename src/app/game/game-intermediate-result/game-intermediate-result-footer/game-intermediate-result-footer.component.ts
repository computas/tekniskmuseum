import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { MatIcon } from '@angular/material/icon';
import { GAMESTATE } from '@/app/shared/models/interfaces';
import { MultiplayerService } from '../../services/multiplayer.service';
import { GameStateService } from '../../services/game-state-service';
import { CustomButtonComponent } from '../../shared-components/custom-button/custom-button.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-game-intermediate-result-footer',
  standalone: true,
  imports: [TranslatePipe, MatIcon, CustomButtonComponent],
  templateUrl: './game-intermediate-result-footer.component.html',
  styleUrl: './game-intermediate-result-footer.component.scss',
  animations: [
    trigger('makeVisible', [
      state('hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      transition('hidden => visible', animate('1s')),
    ]),
  ]
})
export class GameIntermediateResultFooterComponent implements OnInit {
  buttonTextKey = '';
  waitingForPlayerState = 'WAITING';
  isWaitingForPlayer = false;
  progressionButton = 'hidden';
  buttonsAreDisabled = true;
  buttonStyleClass = ButtonStyleClass.forward;

  constructor(private gameStateService: GameStateService, private multiplayerService: MultiplayerService) {}

  ngOnInit(): void {
    this.buttonTextKey = this.getButtonTextKey();

    this.startAnimation();


    if (this.gameStateService.isSingleplayer()) {
      return;
    }
    this.isWaitingForPlayer = true; // default in multiplayer set to true
    this.multiplayerService.stateInfo$.subscribe((res) => {
      if (res.ready) {
        this.isWaitingForPlayer = false;
      }
      this.buttonTextKey = this.getButtonTextKey();
    });
  }

  nextPage(): void {
    if (this.isWaitingForPlayer) return; // in multiplayer - wait for other player

    if (this.gameStateService.isGameOver()) {
      this.gameStateService.showSummary();
      return;
    }

    const isOngoingMultiplayerGame = this.gameStateService.isMultiplayer() && !this.gameStateService.isGameOver();
    if (isOngoingMultiplayerGame) {
      this.gameStateService.goToPage(GAMESTATE.showWord); // can't use nextRound here bc it will increment roundnumber twice
      return;
    }

    this.gameStateService.nextRound(); // ongoing singleplayer game
  }

  getButtonTextKey(): string {
    if (this.gameStateService.isMultiplayer() && this.isWaitingForPlayer) {
      return this.waitingForPlayerState;
    }
    if (this.gameStateService.isGameOver()) {
      return 'SUMMARY_BUTTON';
    }
    if (!this.gameStateService.isGameOver()) {
      return 'NEXT_WORD_BUTTON';
    }
    return '';
  }

  buttonStyle(): string {
    if (this.isWaitingForPlayer) {
      return 'disabled';
    }
    return 'button-container';
  }

  startAnimation() {
    setTimeout(() => {
      this.progressionButton = 'visible';
      this.buttonsAreDisabled = false;
    }, 800);
  };
}
