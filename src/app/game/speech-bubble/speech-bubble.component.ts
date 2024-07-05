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

  private _pointerSide: PointerSide = PointerSide.Bottom;
  private _arrowAlignment: ArrowAlignment = ArrowAlignment.Center;
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

  //computedClasses: string = `${this._pointerSide}, ${this._arrowAlignment}, ${this._isFlipped ? 'flip' : ''}`.trim();

  computedClasses(): string[] {
    //return `${this._pointerSide}, ${this._arrowAlignment}, ${this._isFlipped ? 'flip' : ''}`.trim();
    //return ['speech-bubble', this._pointerSide, this._arrowAlignment, this._isFlipped ? 'flip' : ''];
    return ['speech-bubble', 'ptop', 'acenter', 'flip'];
    //return 'speech-bubble ptop acenter flip';
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



/* 

//

UTEN FLIP
top center
right center
bottom center
left center

WITH FLIP
top left flip=right
top right flip=left
right top flip=down
right bottom flip=up
bottom left left/right
bottom right left/right
left top up/down
left bottom up/down



///// flip = true --> pointToCentre



if 

UTEN FLIP
inTopCenter ~ [300-360, 0-60]
inRightCenter ~ [75-105]
inBottomCenter ~ [120-240]
inLeftCenter ~ [255-285]


MED FLIP
inTopLeft ~ (285-300)
inTopRight ~ (60-75)
inRightBottom ~ ()
inRightTop ~ ()
inBottomRight ~ ()
inBottomLeft ~ ()
inLeftTop ~ ()
inLeftBottom ~ ()



 */