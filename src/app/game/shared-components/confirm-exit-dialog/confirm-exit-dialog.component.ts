import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameStateService } from '@/app/game/services/game-state-service';
import { routes } from '@/app/shared/models/routes';
import { Router } from '@angular/router';
import { MultiplayerService } from '@/app/game/services/multiplayer.service';
import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { DrawingService } from '@/app/game/services/drawing.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-confirm-exit-dialog',
  templateUrl: './confirm-exit-dialog.component.html',
  styleUrls: ['./confirm-exit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatButton, MatIcon, TranslatePipe],
  animations: [
    trigger('buttonClickEffect', [
      state('normal', style({transform: 'scale(1)',})),
      state('clicked', style({transform: 'scale(1.1)',})),
      transition('normal => clicked', [animate('0.1s ease-out')]),
      transition('clicked => normal', [animate('0.1s ease-in')]),
    ])
  ]
})
export class ConfirmExitDialogComponent implements OnInit, OnDestroy{
  readonly dialogRef = inject(MatDialogRef<ConfirmExitDialogComponent>);

  timer = 0;
  startTime = 10;
  countdownInterval = 0;
  buttonStateHome = 'normal';
  buttonStateCancel = "normal";

  constructor(
    private router: Router,
    private gameStateService: GameStateService,
    private multiplayerService: MultiplayerService,
    private drawingService: DrawingService
  ) {}

  ngOnInit(): void {
      this.startCountdown();
  }

  ngOnDestroy(): void {
      this.clearCountdown();
  }

  startCountdown(): void {
    this.timer = this.startTime;
    this.countdownInterval = window.setInterval(() => {
      this.timer -= 1;
      if (this.timer === 0) {
        this.goToWelcomePage();
      }
    }, 1000);
  }

  clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.timer = this.startTime;
    }
  }

  onNoClick(): void {
    this.clearCountdown();
    this.dialogRef.close();
  }

  closeDialog() {
    this.buttonStateCancel = "clicked";

    setTimeout(() => {
      this.buttonStateCancel = "normal";
      setTimeout(() => {
        this.dialogRef.close();
      }, 100)
    }, 100);
  }

  goToWelcomePage() {
    this.buttonStateHome = "clicked";
    setTimeout(() => {
      this.buttonStateHome = "normal";
      setTimeout(() => {
        this.clearCountdown();
        this.dialogRef.close();
        this.gameStateService.clearState();
        this.drawingService.clearState();
        if (this.gameStateService.isMultiplayer()) {
          this.multiplayerService.clearState();
        }
    this.router.navigate([routes.WELCOME]);
      }, 100)
    }, 100);
  }
}
