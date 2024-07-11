import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../core/translation.pipe';
import { SpeechBubbleComponent } from '../game/speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '../shared/customColors';
import { ArrowAlignment, PointerSide } from '../shared/models/interfaces';

@Component({
    selector: 'app-splash',
    templateUrl: './splash.component.html',
    styleUrls: ['./splash.component.scss'],
    standalone: true,
    imports: [SpeechBubbleComponent, TranslatePipe],
})
export class SplashComponent {
    textColor: CustomColorsIO = CustomColorsIO.black;
    PointerSide = PointerSide;
    ArrowAlignment = ArrowAlignment;
    CustomColorsIO = CustomColorsIO;

    constructor(private router: Router) {}

    navigateToWelcome() {
        this.router.navigate(['/welcome']);
    }
}
