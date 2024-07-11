import { Component, OnInit, OnDestroy } from '@angular/core';
import { ExampleDrawingService } from '../../services/example-drawing.service';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { ArrowAlignment, PointerSide, SupportedLanguages } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { DrawingService } from '../../services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-example-drawings',
  standalone: true,
  imports: [SpeechBubbleComponent, TranslatePipe],
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
    private exampleDrawingService: ExampleDrawingService
  ) {}
  ngOnInit(): void {
    this.label = this.drawingService.label;
    const getExampleDrawingsParams = { n: 3, label: this.label, lang: this.language };
    this.subscriptions.add(
      this.exampleDrawingService.getExampleDrawings(getExampleDrawingsParams).subscribe((res) => {
        this.exampleDrawings = res;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
