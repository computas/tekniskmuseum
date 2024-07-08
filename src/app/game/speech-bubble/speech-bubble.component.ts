import { CustomColorsIO } from "@/app/shared/customColors";
import { ArrowAlignment, PointerSide } from "@/app/shared/models/interfaces";
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-speech-bubble',
  templateUrl: './speech-bubble.component.html',
  styleUrls: ['./speech-bubble.component.scss'],
  standalone: true,
})
export class SpeechBubbleComponent implements OnInit {
    @Input() textColor: CustomColorsIO = CustomColorsIO.black; // Default color
    @Input() bubbleColor: CustomColorsIO = CustomColorsIO.pastelBlue; // Default color
    @Input() titleText: string | undefined = ''; 
    @Input() bodyText: string  = 'Hello world!';
    
    private _pointerSide: PointerSide = PointerSide.Top;
    private _arrowAlignment: ArrowAlignment = ArrowAlignment.Left;
    private _isFlipped: boolean = false;

    @Input() set pointerSide(value: PointerSide) {
        this._pointerSide = value;
    }

    @Input() set arrowAlignment(value: ArrowAlignment) {
        this._arrowAlignment = value;
    }

    @Input() set isFlipped(value: boolean ) {
        this._isFlipped = value;
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
        this.validateConfiguration();
        return ['speech-bubble', this._pointerSide, this._arrowAlignment, this._isFlipped ? 'flip' : ''];
    }

    ngOnInit(): void {}

    validateConfiguration() {
        const flipNotAllowedCombinations: { side: PointerSide; alignment: ArrowAlignment }[] = [
            { side: PointerSide.Top, alignment: ArrowAlignment.Center },
            { side: PointerSide.Right, alignment: ArrowAlignment.Center },
            { side: PointerSide.Bottom, alignment: ArrowAlignment.Center },
            { side: PointerSide.Left, alignment: ArrowAlignment.Center },
        ]; 

        const flipAllowedCombinations: { side: PointerSide; alignment: ArrowAlignment }[] = [
            { side: PointerSide.Top, alignment: ArrowAlignment.Left },
            { side: PointerSide.Top, alignment: ArrowAlignment.Right },
            { side: PointerSide.Right, alignment: ArrowAlignment.Top },
            { side: PointerSide.Right, alignment: ArrowAlignment.Bottom },
            { side: PointerSide.Bottom, alignment: ArrowAlignment.Left },
            { side: PointerSide.Bottom, alignment: ArrowAlignment.Right },
            { side: PointerSide.Left, alignment: ArrowAlignment.Top },
            { side: PointerSide.Left, alignment: ArrowAlignment.Bottom },
        ];

        const illegalCombos: { side: PointerSide; alignment: ArrowAlignment }[] = [
            { side: PointerSide.Top, alignment: ArrowAlignment.Top },
            { side: PointerSide.Top, alignment: ArrowAlignment.Bottom },
            { side: PointerSide.Right, alignment: ArrowAlignment.Right },
            { side: PointerSide.Right, alignment: ArrowAlignment.Left },
            { side: PointerSide.Bottom, alignment: ArrowAlignment.Top },
            { side: PointerSide.Bottom, alignment: ArrowAlignment.Bottom },
            { side: PointerSide.Left, alignment: ArrowAlignment.Right },
            { side: PointerSide.Left, alignment: ArrowAlignment.Left },
        ];


        const isFlipNotAllowed = flipNotAllowedCombinations.some(
        (combo) => combo.side === this._pointerSide && combo.alignment === this._arrowAlignment
        );

        const isFlipAllowed = flipAllowedCombinations.some(
        (combo) => combo.side === this._pointerSide && combo.alignment === this._arrowAlignment
        );

        const isIllegalCombo = illegalCombos.some(
            (combo) => combo.side === this._pointerSide && combo.alignment === this._arrowAlignment
        );

        this._isFlipped = isFlipAllowed && this._isFlipped;

        if (!isIllegalCombo){
            if (isFlipNotAllowed && this._isFlipped) {
                console.warn(`Illegal combination: ${this._pointerSide} and ${this._arrowAlignment} cannot be flipped. Setting default combination.`);
                this._isFlipped = false;  
            } else {
                console.log(`Legal combination: ${this._pointerSide} and ${this._arrowAlignment} ${this._isFlipped ? 'with' : 'without'} flip.`);
            }
        } else {
            console.warn(`Illegal combination: ${this._pointerSide} and ${this._arrowAlignment}. Setting default combination.`);
            this._pointerSide = PointerSide.Top;
            this._arrowAlignment = ArrowAlignment.Left; 
            this._isFlipped = false;
        }
    } 
}