import { CustomColorsIO } from '@/app/shared/customColors';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-i-avatar',
  templateUrl: './i-avatar.component.html',
  styleUrls: ['./i-avatar.component.scss'],
  standalone: true,
})
export class IAvatarComponent {
  @Input() color: CustomColorsIO = CustomColorsIO.white; // Default color
  @Input() width = 39; // Default width
  @Input() height = 192; // Default height
}
