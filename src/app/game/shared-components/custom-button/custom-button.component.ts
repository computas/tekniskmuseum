import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmExitDialogComponent } from '../confirm-exit-dialog/confirm-exit-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss'],
  standalone: true,
  imports: [MatIcon, ConfirmExitDialogComponent],
  animations: [
    trigger('buttonClickEffect', [
      state('normal', style({transform: 'scale(1)',})),
      state('clicked', style({transform: 'scale(1.1)',})),
      transition('normal => clicked', [animate('0.1s ease-out')]),
      transition('clicked => normal', [animate('0.1s ease-in')]),
    ])
  ]
})

export class CustomButtonComponent {
  @Input() buttonStyle: ButtonStyleClass = ButtonStyleClass.default;
  @Input() buttonText = 'Button';
  @Input() disabled = false;
  @Input() ariaLabel = '';
  @Input() alt = '';
  @Input() innerBackgroundStyle: 'full-gradient-inner' | 'non-gradient-inner' = 'non-gradient-inner';

  // Event emitter for the parent to listen to
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();

  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  openDialog(): void {
    this.dialog.open(ConfirmExitDialogComponent);
  }

  buttonState = 'normal';

  onButtonClick() {
    if (this.disabled) {
      return; 
    }
    this.buttonState = 'clicked';


    setTimeout(() => {
      this.buttonState = 'normal';
      setTimeout(() => {
        if (this.buttonStyle === 'back-button') {
          this.router.navigate(['/welcome']); 
        } 
        else if (this.buttonStyle === 'home-button') {
          this.dialog.open(ConfirmExitDialogComponent);
        }
        else {
          this.buttonClicked.emit();
        }
      }, 100);
    }, 100);
  }
}
