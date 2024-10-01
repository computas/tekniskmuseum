import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpeechBubbleComponent } from '@/app/game/speech-bubble/speech-bubble.component';
import { OAvatarComponent } from '@/assets/avatars/o-avatar/o-avatar.component';
import { ArrowAlignment, Certainty, PointerSide } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { ExampleDrawingService } from '@/app/game/services/example-drawing.service';
import { DrawingService } from '@/app/game/services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';
import { map, Subscription, take } from 'rxjs';
import { GameStateService } from '@/app/game/services/game-state-service';
import { MultiplayerService } from '@/app/game/services/multiplayer.service';

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
  hideImg = false;

  constructor(
    private exampleDrawingService: ExampleDrawingService,
    private drawingService: DrawingService,
    private translationService: TranslationService,
    private gameStateService: GameStateService,
    private multiplayerService: MultiplayerService
  ) {}

  ngOnInit(): void {
    this.label = this.drawingService.lastResult.word;
    this.updateAiGuess(this.drawingService.sortedCertainty);

    if (this.gameStateService.isSingleplayer()) {
      this.exampleDrawings = this.exampleDrawingService.getExampleDrawings(2);
      this.getSingleplayerExamples();
    } else {
      this.getMultiplayerExamples();
      this.exampleDrawings = this.multiplayerService.getExampleDrawings(2);
    }
  }

  ngOnDestroy(): void {
    this.aiGuessSubscription.unsubscribe();
  }

  getSingleplayerExamples() {
    if (this.guess === "") {
      console.log("helo")
      return
    }
    this.aiGuessSubscription.add(
      this.exampleDrawingService
        .getExampleDrawingsFromLabel(2, this.guess, this.translationService.getCurrentLang())
        .subscribe((res) => {
          this.guessedDrawings = res;
        })
    );
  }

  getMultiplayerExamples() {
    this.aiGuessSubscription.add(
      this.multiplayerService
        .getExampleDrawingsFromLabel(2, this.guess, this.translationService.getCurrentLang())
        .pipe(
          take(1),
          map((res: string) => {
            const data = JSON.parse(res);
            return data;
          })
        )
        .subscribe((res) => {
          this.guessedDrawings = res;
        })
    );
  }
  updateAiGuess(sortedCertaintyArr: Certainty[]) {
    if (sortedCertaintyArr && sortedCertaintyArr.length > 1) {
      const bestGuess = sortedCertaintyArr[0].label;
      this.guess = bestGuess === this.label ? sortedCertaintyArr[1].label : bestGuess;
    }
  }
}
