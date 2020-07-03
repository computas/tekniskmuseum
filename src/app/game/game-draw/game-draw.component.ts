import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { take } from 'rxjs/operators';
import { ImageService } from './services/image.service';
import { DrawingService } from './services/drawing.service';
import { StartGameInfo } from './services/start-game-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drawing',
  templateUrl: './game-draw.component.html',
  styleUrls: ['./game-draw.component.scss'],
  animations: [
    trigger('changeDivSize', [
      state(
        'initial',
        style({
          width: '100%',
          color: 'white',
          height: '0',
        })
      ),
      state(
        'final',
        style({
          backgroundColor: 'red',
          height: '100%',
          'text-align': 'center',
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        })
      ),

      transition('initial=>final', animate('300ms')),
      transition('final=>initial', animate('300ms')),
    ]),
  ],
})
export class GameDrawComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;
  x = 0;
  y = 0;
  gameOver = new BehaviorSubject<boolean>(false);
  isDrawing = false;
  timeLeft = 10;
  times = [];
  words = [];
  private ctx: CanvasRenderingContext2D;
  currentState = 'initial';

  // game info
  startGameInfo: StartGameInfo;
  guessWord: string;
  gameToken: string;
  result: boolean;

  constructor(
    private imageService: ImageService,
    private drawingService: DrawingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }

    this.ctx = ctx;
    this.canvas.nativeElement.width = document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight;
    this.startGame();
  }

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame(): void {
    this.startDrawingTimer(this.createDrawingTimer());
    this.drawingService.startGame().subscribe((startGameInfo) => {
      this.startGameInfo = startGameInfo;
      this.guessWord = this.startGameInfo.label;
      this.gameToken = this.startGameInfo.token;
    });
  }

  submitAnswer() {
    const b64Image = this.canvas.nativeElement.toDataURL('image/png');

    this.imageService.resize(b64Image).subscribe({
      next: (dataUrl) => {
        const formData: FormData = this.imageService.createFormData(dataUrl);
        formData.append('token', this.gameToken);
        this.drawingService.submitAnswer(formData, dataUrl).subscribe();
      },
    });
  }

  getClientOffset(event) {
    const { pageX, pageY } = event.touches ? event.touches[0] : event;
    const x = pageX - this.canvas.nativeElement.offsetLeft;
    const y = pageY - this.canvas.nativeElement.offsetTop;

    return { x, y };
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.gameOver.getValue() && this.isDrawing) {
      const { x, y } = this.getClientOffset(e);
      this.drawLine(this.x, this.y, x, y);
      this.x = x;
      this.y = y;
    }
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  clear() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
    this.gameOver.next(false);
    this.timeLeft = 10;
    this.countDown.nativeElement.style.color = 'white';
    this.startGame();
  }

  stop(e) {
    if (!this.gameOver.getValue() && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.isDrawing = false;
    }
  }

  resultNavigation() {
    this.router.navigate(['/result']);
  }

  private createDrawingTimer() {
    return new Observable((observer) => {
      let color = 'red';
      interval(100)
        .pipe(take(10 * this.timeLeft))
        .subscribe((tics) => {
          if (tics % 10 === 9) {
            this.timeLeft--;
          }
          if (this.timeLeft <= 5) {
            this.countDown.nativeElement.style.color = color;
            color = color === 'white' ? 'red' : 'white';
          }
          if (this.timeLeft === 0) {
            observer.complete();
          }
        });
    });
  }

  private startDrawingTimer(timer) {
    timer.subscribe({
      complete: () => {
        this.gameOver.next(true);
        this.currentState =
          this.currentState === 'initial' ? 'final' : 'initial';
        this.submitAnswer();
        this.resultNavigation();
      },
    });
  }
}
