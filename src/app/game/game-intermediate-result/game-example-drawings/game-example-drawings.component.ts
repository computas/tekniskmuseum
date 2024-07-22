import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExampleDrawingService } from '../../services/example-drawing.service';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { ArrowAlignment, PointerSide, SupportedLanguages } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { DrawingService } from '../../services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';
import { Subscription } from 'rxjs';
import { GameStateService } from '../../services/game-state-service';
import { MultiplayerService } from '../../services/multiplayer.service';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';

@Component({
  selector: 'app-game-example-drawings',
  standalone: true,
  imports: [SpeechBubbleComponent, TranslatePipe, OAvatarComponent],
  templateUrl: './game-example-drawings.component.html',
  styleUrl: './game-example-drawings.component.scss',
})
export class GameExampleDrawingsComponent implements OnInit, OnDestroy {
  language: SupportedLanguages = this.translationService.getCurrentLang();
  exampleDrawings: string[] = [];
  label = '';
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  hasCorrectGuess = this.drawingService.lastResult.hasWon;
  subscriptions = new Subscription();
  constructor(
    private translationService: TranslationService,
    private drawingService: DrawingService,
    private exampleDrawingService: ExampleDrawingService,
    private gameStateService: GameStateService,
    private multiplayerService: MultiplayerService
  ) {}
  ngOnInit(): void {
    this.label = this.drawingService.label;
    if (this.gameStateService.isSingleplayer()) {
      this.exampleDrawings = this.exampleDrawingService.getExampleDrawings();
      return;
    }
    this.exampleDrawings = this.multiplayerService.getExampleDrawings();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
