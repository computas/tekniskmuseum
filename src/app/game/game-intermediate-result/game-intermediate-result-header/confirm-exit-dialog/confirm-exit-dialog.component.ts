import { TranslatePipe } from '@/app/core/translation.pipe';
import { GameStateService } from '@/app/game/services/game-state-service';
import { routes } from '@/app/shared/models/routes';
import { Router } from '@angular/router';
import { MultiplayerService } from '@/app/game/services/multiplayer.service';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-exit-dialog',
  templateUrl: './confirm-exit-dialog.component.html',
  styleUrls: ['./confirm-exit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatDialogActions, MatDialogContent, MatButton, MatIcon, TranslatePipe],
})
export class ConfirmExitDialogComponent {
  constructor(
    private router: Router,
    private gameStateService: GameStateService,
    private multiplayerService: MultiplayerService
  ) {}

  readonly dialogRef = inject(MatDialogRef<ConfirmExitDialogComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  goToWelcomePage() {
    this.dialogRef.close();
    this.gameStateService.clearState();

    if (this.gameStateService.isMultiplayer()) {
      this.multiplayerService.clearState();
    }

    this.router.navigate([routes.WELCOME]);
  }
}
