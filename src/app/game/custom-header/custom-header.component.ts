import { Component, inject, input, Input } from '@angular/core';
import { GameProgressBarComponent } from '../game-intermediate-result/game-intermediate-result-header/game-progress-bar/game-progress-bar.component';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExitDialogComponent } from '../game-intermediate-result/game-intermediate-result-header/confirm-exit-dialog/confirm-exit-dialog.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [GameProgressBarComponent, TranslatePipe, CustomButtonComponent, RouterLink, RouterLinkActive], 
  templateUrl: './custom-header.component.html',
  styleUrl: './custom-header.component.scss'
})
export class CustomHeaderComponent {
  //Custom button input, 
  @Input() buttonStyle: ButtonStyleClass = ButtonStyleClass.default; // Allows customization of the button style
  @Input() buttonText: string = 'Button'; // Default button text
  @Input() iconSrc = ""; //remove this and put this as a constant logic in custom button, since every back button has same logo, and and home button has same logo. 
  @Input() routerLink?: string;
  @Input() activeRouter?: boolean; 
  // Progress bar to be shown
  @Input() showProgressBar: boolean = false;


  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }

  

}
