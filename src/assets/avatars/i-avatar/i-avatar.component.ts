import { CustomColorsIO } from '@/app/shared/customColors';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-i-avatar',
  templateUrl: './i-avatar.component.html',
  styleUrls: ['./i-avatar.component.scss'],
  standalone: true,
})
export class IAvatarComponent {
  @Input() color: CustomColorsIO = CustomColorsIO.black; // Default color
  @Input() width: number = 39; // Default width
  @Input() height: number = 192; // Default height
}
