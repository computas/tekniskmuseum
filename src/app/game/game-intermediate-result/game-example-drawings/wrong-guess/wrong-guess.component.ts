import { Component, OnInit } from '@angular/core';
import { SpeechBubbleComponent } from '@/app/game/speech-bubble/speech-bubble.component';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { ExampleDrawingService } from '@/app/game/services/example-drawing.service';

@Component({
  selector: 'app-wrong-guess',
  standalone: true,
  imports: [SpeechBubbleComponent, OAvatarComponent, TranslatePipe],
  templateUrl: './wrong-guess.component.html',
  styleUrl: './wrong-guess.component.scss',
})
export class WrongGuessComponent implements OnInit {
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  label = 'Tiger';
  exampleDrawings: string[] = [];
  guessedDrawings: string[] = [];

  constructor(private exampleDrawingService: ExampleDrawingService) {}

  ngOnInit(): void {
    this.exampleDrawings = this.exampleDrawingService.getExampleDrawings(2);
    /*
    for (let i = 0; i < 2; i++) {
      this.exampleDrawings.push('example' + i + '.jpg');
      this.guessedDrawings.push('guess' + i + '.jpg');
    }
      */
  }
}
