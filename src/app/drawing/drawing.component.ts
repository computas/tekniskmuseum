import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
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
        // console.log('gameover');
        this.submitAnswer();
      },
    });
  }

  submitAnswer() {}

  start(e: MouseEvent | TouchEvent) {
    const { x, y } = this.getClientOffset(e);
    this.x = x;
    this.y = y;
    this.isDrawing = true;
  }

  startGame() {
    // TODO FETCH WORD FROM BACKEND
  }

  getClientOffset = (event) => {
    const { pageX, pageY } = event.touches ? event.touches[0] : event;
    const x = pageX - this.canvas.nativeElement.offsetLeft;
    const y = pageY - this.canvas.nativeElement.offsetTop;

    return {
      x,
      y,
    };
  };
  draw(e: MouseEvent | TouchEvent) {
    if (!this.gameOver.getValue() && this.isDrawing) {
      const { x, y } = this.getClientOffset(e);
      this.drawLine(this.x, this.y, x, y);
      this.x = x;
      this.y = y;
    }
  }

  clear() {
    const canvas = this.canvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  stop(e) {
    if (!this.gameOver.getValue() && this.isDrawing) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.isDrawing = false;
    }
  }

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
