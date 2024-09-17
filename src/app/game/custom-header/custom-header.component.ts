import { Component, inject, Input } from '@angular/core';
import { GameProgressBarComponent } from '../game-intermediate-result/game-intermediate-result-header/game-progress-bar/game-progress-bar.component';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExitDialogComponent } from '../game-intermediate-result/game-intermediate-result-header/confirm-exit-dialog/confirm-exit-dialog.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [GameProgressBarComponent, TranslatePipe, CustomButtonComponent],
  templateUrl: './custom-header.component.html',
  styleUrl: './custom-header.component.scss'
})
export class CustomHeaderComponent {
  //Custom button input, 
  @Input() buttonStyle: ButtonStyleClass = ButtonStyleClass.default; // Allows customization of the button style
  @Input() buttonText: string = 'Button'; // Default button text

  // Progress bar to be shown
  @Input() showProgressBar: boolean = false;


  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }

  

}
