import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DrawingService } from '../services/drawing.service';
import { MultiplayerService } from '../services/multiplayer.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpperCasePipe } from '@angular/common';
import { GameConfigService } from '../services/game-config.service';
import { TranslationService } from '@/app/core/translation.service';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { GAMESTATE } from '@/app/shared/models/interfaces';
import { GameStateService } from '../services/game-state-service';
import { ExampleDrawingService } from '../services/example-drawing.service';
import { Router } from '@angular/router';
import { IAvatarComponent } from '@/assets/avatars/i-avatar/i-avatar.component';
import { SpeechBubbleComponent } from '../speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '@/app/shared/customColors';
import { PointerSide, ArrowAlignment } from '@/app/shared/models/interfaces';
import { CustomButtonComponent } from '../shared-components/custom-button/custom-button.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { ConfirmExitDialogComponent } from '../shared-components/confirm-exit-dialog/confirm-exit-dialog.component';
import { routes } from '../../shared/models/routes';
import { CustomHeaderComponent } from '../shared-components/custom-header/custom-header.component';

@Component({
  selector: 'app-game-word-to-draw',
  templateUrl: './game-word-to-draw.component.html',
  styleUrls: ['./game-word-to-draw.component.scss'],
  standalone: true,
  imports: [
    MatProgressSpinner,
    MatButton,
    MatIcon,
    UpperCasePipe,
    TranslatePipe,
    IAvatarComponent,
    SpeechBubbleComponent,
    CustomButtonComponent,
    CustomHeaderComponent
  ],
})
export class GameWordToDrawComponent implements OnInit, OnDestroy {
  config = this.gameConfigService.getConfig;

  isSinglePlayer = false;
  isMultiPlayer = false;
  playernr = '';
  totalRounds = this.config.rounds;
  guessUsed = 1;
  timeLeft = 5;

  loading = true;
  difficulty = 0;

  label = '';

  subscriptions = new Subscription();
  timerSubscription: Subscription | undefined;

  CustomColorsIO = CustomColorsIO;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;

  homeButtonStyleClass = ButtonStyleClass.home;
  forwardButtonStyleClass = ButtonStyleClass.forward;

  //To prompt when wanting to quit game after a round. Earlier it did not prompt at all. 
  readonly dialog = inject(MatDialog);

  constructor(
    private gameConfigService: GameConfigService,
    private gameStateService: GameStateService,
    private drawingService: DrawingService,
    private multiplayerService: MultiplayerService,
    private translationService: TranslationService,
    private exampleDrawingService: ExampleDrawingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.gameStateService.savePageToLocalStorage(GAMESTATE.showWord);
    this.translationService.loadTranslations(this.translationService.getCurrentLang()).subscribe();
    this.isSinglePlayer = this.gameStateService.isSingleplayer();
    this.isMultiPlayer = this.gameStateService.isMultiplayer();
    this.difficulty = this.gameStateService.getDifficulty();
    if (this.isSinglePlayer) {
      if (this.drawingService.gameHasStarted) {
        this.subscriptions.add(
          this.drawingService.getLabel().subscribe({
            next: (res) => {
              this.label = res.label;
              this.loading = false;
            },
            error: (error) => {
              console.error("An error occurred while fetching the label:", error.message);
              this.loading = false;
            },
          })
        );

        this.subscriptions.add(
          this.drawingService.guessUsed$.subscribe((res) => {
            this.guessUsed = res;
          })
        );
      }
      else {
        this.subscriptions.add(
        this.drawingService.startGame().subscribe({
          next: () => {
            this.loading = false;
            this.label = this.drawingService.label;
            this.drawingService.gameHasStarted = true;
          },
          error: (error) => {
            console.error("An error occurred while starting the game:", error);
            this.snackBar.open('Oops, noe gikk galt. Vennligst prøv igjen senere.', 'Close', {
              duration: 6000,
            });
            setTimeout(() => {
              this.loading = false;
              this.goHome();
            }, 3000);
          },
        })
        );
      }
    }
    if (this.isMultiPlayer) {
      this.gameStateService.updateRoundNumber();
      const player = this.multiplayerService.stateInfo.player_nr;
      this.playernr = player === 'player_1' ? '1' : '2';
      this.guessUsed = this.drawingService.guessUsed;
      this.subscriptions.add(
        this.multiplayerService.getLabel().subscribe((label) => {
          if (label) {
            this.multiplayerService.stateInfo = {
              ...this.multiplayerService.stateInfo,
              label,
            };
            this.label = label;
            this.loading = false;
            this.subscriptions.add(this.startTimer().subscribe());
          }
        })
      );
    }
  }


  toDrawingBoard() {
    if (this.gameStateService.isSingleplayer()) {
      this.exampleDrawingService.preLoadExampleDrawings(3, this.label, this.translationService.getCurrentLang());
    } else {
      // 6 images because we want the players to have different examples: 2 players x 3 imgs = 6 imgs
      this.multiplayerService.preLoadExampleDrawings(6, this.label, this.translationService.getCurrentLang());
    }
    this.gameStateService.goToPage(GAMESTATE.drawingBoard);
  }

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }

  startTimer() {
    return interval(1000)
      .pipe(take(5))
      .pipe(
        tap(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, gameState: GAMESTATE.drawing };
            this.toDrawingBoard();
          }
        })
      );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  goHome() {
    this.router.navigate([routes.LANDING]);
  }

  buttonStyle(): string {
    if (!this.loading && !this.isMultiPlayer) {
      return 'button-container';
    }
    return 'button-container disabled';
  }
}
