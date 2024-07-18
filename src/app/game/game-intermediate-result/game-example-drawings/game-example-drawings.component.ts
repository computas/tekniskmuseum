import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExampleDrawingService } from '../../services/example-drawing.service';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { ArrowAlignment, PointerSide, SupportedLanguages } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { DrawingService } from '../../services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';
import { Subscription } from 'rxjs';
import { ExampleDrawingsData } from '@/app/shared/models/backend-interfaces';
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
  hasCorrectGuess = true; // this.drawingService.lastResult.hasWon;
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
    const exampleDrawingsParams: ExampleDrawingsData = this.getExampleDrawingsParams();
    if (this.gameStateService.isSingleplayer()) {
      this.subscriptions.add(
        this.exampleDrawingService.getExampleDrawings(exampleDrawingsParams).subscribe((res) => {
          this.exampleDrawings = res;
        })
      );
      return;
    }

    this.subscriptions.add(
      this.multiplayerService.getExampleDrawings(exampleDrawingsParams).subscribe((res) => {
        this.exampleDrawings = res;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getExampleDrawingsParams(): ExampleDrawingsData {
    let gameId: string | undefined = '';
    if (this.gameStateService.isMultiplayer()) {
      gameId = this.multiplayerService.stateInfo.game_id;
    }

    return {
      game_id: gameId,
      number_of_images: 3,
      label: this.label,
      lang: this.language,
    };
  }
}
