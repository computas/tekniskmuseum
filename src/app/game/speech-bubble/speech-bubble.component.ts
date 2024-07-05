import { CustomColorsIO } from "@/app/shared/customColors";
import { Component, Input, OnInit } from '@angular/core';

export enum PointerSide {
  Top = 'ptop',
  Right = 'pright',
  Bottom = 'pbottom',
  Left = 'pleft',
}

export enum ArrowAlignment {
  Center = 'acenter',
  Left = 'aleft',
  Right = 'aright',
  Top = 'atop',
  Bottom = 'abottom',
}

@Component({
  selector: 'app-speech-bubble',
  templateUrl: './speech-bubble.component.html',
  styleUrls: ['./speech-bubble.component.scss'],
  standalone: true,
})
export class SpeechBubbleComponent implements OnInit {
  @Input() bubbleColor: CustomColorsIO = CustomColorsIO.pastelBlue; // Default color

  
  titleText: string | undefined = 'Hei! Jeg heter IO'; 
  bodyText: string  = 'Hjelp meg å lære? 🥹';

  private _pointerSide: PointerSide = PointerSide.Top;
  private _arrowAlignment: ArrowAlignment = ArrowAlignment.Right;
  private _isFlipped: boolean = false;

  @Input() set pointerSide(value: PointerSide) {
    this._pointerSide = value;
    this.validateConfiguration();
  }

  @Input() set arrowAlignment(value: ArrowAlignment) {
    this._arrowAlignment = value;
    this.validateConfiguration();
  }

  @Input() set isFlipped(value: boolean) {
    this._isFlipped = value;
    this.validateConfiguration();
  }

  get pointerSide() {
    return this._pointerSide;
  }

  get arrowAlignment() {
    return this._arrowAlignment;
  }

  get isFlipped() {
    return this._isFlipped;
  }

  computedClasses(): string[] {
    return ['speech-bubble', this._pointerSide, this._arrowAlignment, this._isFlipped ? 'flip' : ''];
  }

  constructor() {}

  ngOnInit(): void {}

  validateConfiguration() {
    const noFlipCombinations = [
      { side: PointerSide.Top, alignment: ArrowAlignment.Center },
      { side: PointerSide.Right, alignment: ArrowAlignment.Center },
      { side: PointerSide.Bottom, alignment: ArrowAlignment.Center },
      { side: PointerSide.Left, alignment: ArrowAlignment.Center }
    ];

    const flipCombinations = [
      { side: PointerSide.Top, alignment: ArrowAlignment.Left, flip: true },
      { side: PointerSide.Top, alignment: ArrowAlignment.Right, flip: true },
      { side: PointerSide.Right, alignment: ArrowAlignment.Top, flip: true },
      { side: PointerSide.Right, alignment: ArrowAlignment.Bottom, flip: true },
      { side: PointerSide.Bottom, alignment: ArrowAlignment.Left, flip: true },
      { side: PointerSide.Bottom, alignment: ArrowAlignment.Right, flip: true },
      { side: PointerSide.Left, alignment: ArrowAlignment.Top, flip: true },
      { side: PointerSide.Left, alignment: ArrowAlignment.Bottom, flip: true }
    ];

    if (noFlipCombinations.some(combo => combo.side === this._pointerSide && combo.alignment === this._arrowAlignment)) {
      this._isFlipped = false;
    }

    if (!flipCombinations.some(combo => combo.side === this._pointerSide && combo.alignment === this._arrowAlignment && combo.flip === this._isFlipped)) {
      this._isFlipped = false;
    }
  }
}