import { Component, inject } from '@angular/core';
import { GameProgressBarComponent } from './game-progress-bar/game-progress-bar.component';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExitDialogComponent } from './confirm-exit-dialog/confirm-exit-dialog.component';
import { CustomButton } from '../../custom-button/custom-button.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';

@Component({
  selector: 'app-game-intermediate-result-header',
  standalone: true,
  imports: [GameProgressBarComponent, TranslatePipe, CustomButton],
  templateUrl: './game-intermediate-result-header.component.html',
  styleUrl: './game-intermediate-result-header.component.scss',
})
export class GameIntermediateResultHeaderComponent {
  readonly dialog = inject(MatDialog);

  homeButtonStyleClass = ButtonStyleClass.home;

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }
}
