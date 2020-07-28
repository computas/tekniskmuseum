import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { GAMELEVEL } from '../../multiplayer/services/multiplayer.service';
import { DrawingService } from '../game-draw/services/drawing.service';
import { SPEECH } from 'src/app/shared/speech-text/text';
import { SpeechService } from 'src/app/services/speech.service';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/models/routes';
import { MultiplayerService } from 'src/app/multiplayer/services/multiplayer.service';

@Component({
  selector: 'app-game-word-to-draw',
  templateUrl: './game-word-to-draw.component.html',
  styleUrls: ['./game-word-to-draw.component.scss'],
})
export class GameWordToDrawComponent implements OnInit, OnDestroy {
  constructor(
    private drawingService: DrawingService,
    private speechService: SpeechService,
    private multiplayerService: MultiplayerService,
    private router: Router
  ) {}
  isSinglePlayer = false;
  isMultiPlayer = false;
  @Output() drawWord = new EventEmitter();
  word = '';
  guessUsed = 1;

  timeLeft = 5;

  loading = true;
  playernr: string;

  subscriptions = new Subscription();
  timerSubscription: Subscription;

  ngOnInit(): void {
    if (this.router.url === `/${routes.SINGLEPLAYER}`) {
      this.isSinglePlayer = true;
    } else {
      this.isMultiPlayer = true;
    }
    if (this.isSinglePlayer) {
      if (this.drawingService.gameHasStarted) {
        this.subscriptions.add(
          this.drawingService.getLabel().subscribe((res) => {
            this.word = res.label;
            this.loading = false;
          })
        );
        this.subscriptions.add(
          this.drawingService.guessUsed$.subscribe((res) => {
            this.guessUsed = res;
          })
        );
      } else {
        this.subscriptions.add(
          this.drawingService.startGame().subscribe((res) => {
            this.loading = false;
            this.word = this.drawingService.label;
            this.drawingService.gameHasStarted = true;
          })
        );
        this.subscriptions.add(
          this.drawingService.guessUsed$.subscribe((res) => {
            this.guessUsed = res;
          })
        );
      }
    }
    if (this.isMultiPlayer) {
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
            this.word = label;
            this.loading = false;
            this.subscriptions.add(this.startTimer().subscribe());
          }
        })
      );
    }
  }

  startTimer() {
    return interval(1000)
      .pipe(take(5))
      .pipe(
        tap((tics) => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
            this.multiplayerService.stateInfo = { ...this.multiplayerService.stateInfo, gameLevel: GAMELEVEL.drawing };
          }
        })
      );
  }

  speakWord() {
    this.speechService.speak(`${SPEECH.draw}${this.word}`);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
