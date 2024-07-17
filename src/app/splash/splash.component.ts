import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { SpeechBubbleComponent } from '../game/speech-bubble/speech-bubble.component';
import { CustomColorsIO } from '../shared/customColors';
import { ArrowAlignment, PointerSide } from '../shared/models/interfaces';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: true,
  imports: [CommonModule, SpeechBubbleComponent],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1100)
      ]),
      transition('* => void', [
        animate(700, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SplashComponent implements OnInit, OnDestroy {
  textColor: CustomColorsIO = CustomColorsIO.black;
  PointerSide = PointerSide;
  ArrowAlignment = ArrowAlignment;
  CustomColorsIO = CustomColorsIO;
  interval: ReturnType<typeof setInterval> | null = null;
  currentBubbleIndex = 0;
  animating = false;

  speechBubbles: string[] = [];
  pressToPlayText: string = '';
  svgs = [
    'assets/I-teaching-O-1.svg',
    'assets/I-teaching-O-2.svg',
    'assets/I-teaching-O-2.svg'
  ];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadTexts();

    this.interval = setInterval(() => {
      if (this.currentBubbleIndex === this.speechBubbles.length - 1) {
        this.animating = true;
        setTimeout(() => {
          this.currentBubbleIndex = 0;
          this.animating = false;
        }, 1100);
      } else {
        this.currentBubbleIndex++;
      }
    }, 3500);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  navigateToWelcome() {
    this.router.navigate(['/welcome']);
  }

  private loadTexts() {
    this.http.get<Record<string, string>>('assets/translation/NO.json').subscribe(translations => {
      this.speechBubbles = [
        translations['I_TEACHING_O_1'],
        translations['I_TEACHING_O_2'],
        translations['I_TEACHING_O_3']
      ];
      this.pressToPlayText = translations['PRESS_TO_PLAY'];
    });
  }

  get currentBubbleText(): string {
    return this.speechBubbles[this.currentBubbleIndex];
  }

  get currentSvg(): string {
    return this.svgs[this.currentBubbleIndex];
  }

  get currentBubbleColor(): CustomColorsIO {
    return this.currentBubbleIndex === 1 ? CustomColorsIO.indigo : CustomColorsIO.cobaltBlue;
  }

  get currentBubbleTextColor(): CustomColorsIO {
    return CustomColorsIO.white;
  }

  get currentPointerSide(): PointerSide {
    return PointerSide.Bottom;
  }

  get currentArrowAlignment(): ArrowAlignment {
    return this.currentBubbleIndex === 1 ? ArrowAlignment.Right : ArrowAlignment.Left;
  }
}
