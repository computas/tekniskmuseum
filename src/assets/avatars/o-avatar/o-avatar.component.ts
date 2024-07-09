import { CustomColorsIO } from '@/app/shared/customColors';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-o-avatar',
  templateUrl: './o-avatar.component.html',
  styleUrls: ['./o-avatar.component.scss'], 
  standalone: true
})
export class OAvatarComponent {
    @Input() color: CustomColorsIO = CustomColorsIO.black; // Default color
    
    height = 192;
    width = 192;
}