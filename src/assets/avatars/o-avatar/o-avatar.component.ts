import { CustomColorsIO } from '@/app/shared/customColors';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-o-avatar',
  templateUrl: './o-avatar.component.html',
  styleUrls: ['./o-avatar.component.scss'],
  standalone: true,
})
export class OAvatarComponent {
  @Input() color: CustomColorsIO = CustomColorsIO.black; // Default color
  @Input() width: number = 192; // Default width
  @Input() height: number = 192; // Default height
}
