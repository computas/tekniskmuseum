import { Component, OnInit } from '@angular/core';
import { ExampleDrawingService } from '../../services/example-drawing.service';
import { SpeechBubbleComponent } from '../../speech-bubble/speech-bubble.component';
import { ArrowAlignment, PointerSide, SupportedLanguages } from '@/app/shared/models/interfaces';
import { CustomColorsIO } from '@/app/shared/customColors';
import { TranslatePipe } from '@/app/core/translation.pipe';
import { DrawingService } from '../../services/drawing.service';
import { TranslationService } from '@/app/core/translation.service';

@Component({
  selector: 'app-game-example-drawings',
  standalone: true,
  imports: [SpeechBubbleComponent, TranslatePipe],
  templateUrl: './game-example-drawings.component.html',
  styleUrl: './game-example-drawings.component.scss',
})
export class GameExampleDrawingsComponent implements OnInit {
  language: SupportedLanguages = this.translationService.getCurrentLang();
  exampleDrawings: string[] = [];
  label = '';
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  hasCorrectGuess = this.drawingService.lastResult.hasWon;
  constructor(
    private translationService: TranslationService,
    private drawingService: DrawingService,
    private exampleDrawingService: ExampleDrawingService
  ) {}
  ngOnInit(): void {
    this.label = this.drawingService.label;
    this.exampleDrawingService.getExampleDrawings(3, this.label, this.language).subscribe((res) => {
      this.exampleDrawings = res;
    });
  }
}
