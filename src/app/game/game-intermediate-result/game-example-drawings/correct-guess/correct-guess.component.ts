import { Component, OnInit } from '@angular/core';
import { SpeechBubbleComponent } from '@/app/game/speech-bubble/speech-bubble.component';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { MultiplayerService } from '@/app/game/services/multiplayer.service';
import { ExampleDrawingService } from '@/app/game/services/example-drawing.service';
import { DrawingService } from '@/app/game/services/drawing.service';
import { GameStateService } from '@/app/game/services/game-state-service';

@Component({
  selector: 'app-correct-guess',
  standalone: true,
  imports: [SpeechBubbleComponent, OAvatarComponent, TranslatePipe],
  templateUrl: './correct-guess.component.html',
  styleUrl: './correct-guess.component.scss',
})
export class CorrectGuessComponent implements OnInit {
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  label = '';
  exampleDrawings: string[] = [];

  constructor(
    private drawingService: DrawingService,
    private exampleDrawingService: ExampleDrawingService,
    private gameStateService: GameStateService,
    private multiplayerService: MultiplayerService
  ) {}

  ngOnInit(): void {
    this.label = this.drawingService.label;
    if (this.gameStateService.isSingleplayer()) {
      this.exampleDrawings = this.exampleDrawingService.getExampleDrawings(3);
    } else {
      this.exampleDrawings = this.multiplayerService.getExampleDrawings(3);
    }
  }
}
