import { Component, inject, Input } from '@angular/core';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExitDialogComponent } from '../game-intermediate-result/game-intermediate-result-header/confirm-exit-dialog/confirm-exit-dialog.component';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIcon, CommonModule],
})
export class CustomButtonComponent {
  @Input() buttonStyle: ButtonStyleClass = ButtonStyleClass.default;
  @Input() buttonText = 'Button';
  @Input() disabled = false;
  @Input() ariaLabel = '';
  @Input() alt = '';
  @Input() iconSrc?: string;
  @Input() innerBackgroundStyle: 'full-gradient-inner' | 'non-gradient-inner' = 'non-gradient-inner';


  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }
  clickHandler(): void {
    if (this.disabled) {
      return; 
    }
    if (this.buttonStyle === 'back-button') {
      this.router.navigate(['/welcome']); 
    } 
    else if (this.buttonStyle === 'home-button') {
      this.openDialog();  
    }
  }

}
