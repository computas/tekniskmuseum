import { Component, Input } from '@angular/core';
import { GameProgressBarComponent } from '../../game-intermediate-result/game-progress-bar/game-progress-bar.component';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { ButtonStyleClass } from '@/app/shared/buttonStyles';

@Component({
  selector: 'app-custom-header',
  standalone: true,
  imports: [GameProgressBarComponent, TranslatePipe, CustomButtonComponent], 
  templateUrl: './custom-header.component.html',
  styleUrl: './custom-header.component.scss'
})
export class CustomHeaderComponent {
  @Input() buttonStyle: ButtonStyleClass = ButtonStyleClass.default; 
  @Input() buttonText: string = 'Button'; 
  @Input() showProgressBar: boolean = false;
}
