import { Component } from '@angular/core';
import { SpeechBubbleComponent } from '@/app/game/speech-bubble/speech-bubble.component';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';

@Component({
  selector: 'app-wrong-guess',
  standalone: true,
  imports: [SpeechBubbleComponent, OAvatarComponent, TranslatePipe],
  templateUrl: './wrong-guess.component.html',
  styleUrl: './wrong-guess.component.scss',
})
export class WrongGuessComponent {
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  label = '';
  exampleDrawings: string[] = [];
  guessedDrawings: string[] = [];
}
