import { Component, OnInit } from '@angular/core';
import { ExampleDrawingService } from '../../services/example-drawing.service';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { ArrowAlignment, PointerSide, SupportedLanguages } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { DrawingService } from '../../services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';
import * as NO from '../../../../assets/translation/NO.json';
import * as EN from '../../../../assets/translation/EN.json';

@Component({
  selector: 'app-game-example-drawings',
  standalone: true,
  imports: [SpeechBubbleComponent, TranslatePipe],
  templateUrl: './game-example-drawings.component.html',
  styleUrl: './game-example-drawings.component.scss',
})
export class GameExampleDrawingsComponent implements OnInit {
  exampleDrawings: string[] = [];
  label: string = '';
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  constructor(
    private translationService: TranslationService,
    private drawingService: DrawingService,
    private exampleDrawingService: ExampleDrawingService
  ) {}
  ngOnInit(): void {
    this.label = this.drawingService.label;
    this.exampleDrawingService.getExampleDrawings(3, this.label).subscribe((res) => {
      this.exampleDrawings = res;
    });
  }

  getMessage(): string {
    const language: SupportedLanguages = this.translationService.getCurrentLang();
    const hasCorrectGuess = true; //this.drawingService.lastResult.hasWon;
    return this.getTranslatedMessage(this.label, language, hasCorrectGuess);
  }

  getTranslatedMessage(label: string, lang: SupportedLanguages, hasCorrectGuess: boolean): string {
    if (hasCorrectGuess) {
      switch (lang) {
        case 'NO':
          return `${NO.EXAMPLE_DRAWINGS_FB_CORRECT_P1} ${label} ${NO.EXAMPLE_DRAWINGS_FB_CORRECT_P2}`;
        case 'EN':
          return `${EN.EXAMPLE_DRAWINGS_FB_CORRECT_P1} ${label} ${EN.EXAMPLE_DRAWINGS_FB_CORRECT_P2}`;
        default:
          return '';
      }
    }
    switch (lang) {
      case 'NO':
        return `${NO.EXAMPLE_DRAWINGS_FB_FAILED_P1} ${label} ${NO.EXAMPLE_DRAWINGS_FB_FAILED_P2}`;
      case 'EN':
        return `${EN.EXAMPLE_DRAWINGS_FB_FAILED_P1} ${label} ${EN.EXAMPLE_DRAWINGS_FB_FAILED_P2}`;
      default:
        return '';
    }
  }
}
