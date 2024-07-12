import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../core/translation.pipe';
import { SpeechBubbleComponent } from '../game/speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '../shared/customColors';
import { ArrowAlignment, PointerSide } from '../shared/models/interfaces';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [CommonModule, SpeechBubbleComponent, TranslatePipe],
})
export class SplashComponent implements OnInit, OnDestroy {
  textColor: CustomColorsIO = CustomColorsIO.black;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  isFirstSpeechBubble = true;
  isFirstSvg = true;
  interval: ReturnType<typeof setInterval> | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.interval = setInterval(() => {
      this.isFirstSvg = !this.isFirstSvg;
      this.isFirstSpeechBubble = !this.isFirstSpeechBubble;
    }, 4000);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  navigateToWelcome() {
    this.router.navigate(['/welcome']);
  }
}
