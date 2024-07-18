import { Component, inject } from '@angular/core';
import { GameProgressBarComponent } from './game-progress-bar/game-progress-bar.component';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExitDialogComponent } from './confirm-exit-dialog/confirm-exit-dialog.component';

@Component({
  selector: 'app-game-intermediate-result-header',
  standalone: true,
  imports: [GameProgressBarComponent, TranslatePipe],
  templateUrl: './game-intermediate-result-header.component.html',
  styleUrl: './game-intermediate-result-header.component.scss',
})
export class GameIntermediateResultHeaderComponent {
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }
}
