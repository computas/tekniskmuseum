import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import {
  timer,
  interval,
  Subscription,
  Subject,
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('countDown', { static: true })
  countDown: ElementRef<HTMLSpanElement>;
  x = 0;
  y = 0;
  gameOver = new BehaviorSubject<boolean>(false);
  isDrawing = false;
  drawTotalTime = 5;
  timeLeft = 10;
  times = [];
  words = [];
  guessWord = 'Cat';
  private ctx: CanvasRenderingContext2D;

  constructor() {}

  ngOnInit(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      throw new Error('getContext failed');
    }
    this.ctx = ctx;
    this.canvas.nativeElement.width = document.body.clientWidth;
    this.canvas.nativeElement.height = document.body.clientHeight;
    this.startGame();
    this.startDrawingTimer().subscribe({
      complete: () => {
        console.log('gameover');
        this.submitAnswer();
      },
    });
  }

  submitAnswer() {}

  start(e: MouseEvent) {
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.isDrawing = true;
  }

  startGame() {
    //TODO FETCH WORD FROM BACKEND
  }

  draw(e: MouseEvent) {
    if (!this.gameOver && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.x = e.offsetX;
      this.y = e.offsetY;
    }
  }

  clear() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 5;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  stop(e) {
    if (!this.gameOver && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
  }
  gm() {}

  private startDrawingTimer() {
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
}
