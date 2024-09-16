import { Component, Input } from '@angular/core';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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

  get getStyle(): string {
    return this.buttonStyle;
  }
}
