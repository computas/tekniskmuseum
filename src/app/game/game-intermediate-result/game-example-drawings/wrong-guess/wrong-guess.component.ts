import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpeechBubbleComponent } from '@/app/game/speech-bubble/speech-bubble.component';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { ArrowAlignment, PointerSide } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { ExampleDrawingService } from '@/app/game/services/example-drawing.service';
import { DrawingService } from '@/app/game/services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';
import { Observable, Subscription } from 'rxjs';
import { GameStateService } from '@/app/game/services/game-state-service';

@Component({
  selector: 'app-wrong-guess',
  standalone: true,
  imports: [SpeechBubbleComponent, OAvatarComponent, TranslatePipe],
  templateUrl: './wrong-guess.component.html',
  styleUrl: './wrong-guess.component.scss',
})
export class WrongGuessComponent implements OnInit, OnDestroy {
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  label: string | undefined = '';
  guess = '';
  exampleDrawings: string[] = [];
  guessedDrawings: string[] = [];
  aiGuessSubscription: Subscription = new Subscription();

  constructor(
    private exampleDrawingService: ExampleDrawingService,
    private drawingService: DrawingService,
    private translationService: TranslationService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.exampleDrawings = this.exampleDrawingService.getExampleDrawings(2);
    this.label = this.drawingService.lastResult.word;
    this.guess = this.drawingService.lastResult.guess;

    if (this.gameStateService.isSingleplayer()) {
      this.getSinglePlayerExamples();
    } else {
      // get multiplayer examples
    }
    // TODO handle scenario when ai hasn't guessed at all?
    /*
    for (let i = 0; i < 2; i++) {
      this.exampleDrawings.push('example' + i + '.jpg');
      this.guessedDrawings.push('guess' + i + '.jpg');
    }
      */
  }

  ngOnDestroy(): void {
    this.aiGuessSubscription.unsubscribe();
  }

  getSinglePlayerExamples() {
    this.aiGuessSubscription.add(
      this.exampleDrawingService
        .getExampleDrawingsFromLabel(2, this.guess, this.translationService.getCurrentLang())
        .subscribe((res) => {
          this.guessedDrawings = res;
        })
    );
  }
}
