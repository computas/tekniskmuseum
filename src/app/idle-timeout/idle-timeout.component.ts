import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss']
})
export class IdleTimeoutComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private dialogRef: MatDialogRef<IdleTimeoutComponent>) { }

  startTime = 15;
  timer;
  countdown;

  ngOnInit(): void {
    this.timer = this.startTime;
    this.countdown = setInterval(() => {
      this.timer -= 1;
      if (this.timer === 0) {
        this.resetTimer();
        this.goHome();
      }
    }, 1000);
  }

  goHome() {
    this.closeDialog();
    this.router.navigateByUrl('');
  }

  closeDialog() {
    clearInterval(this.countdown);
    this.dialogRef.close();
  }

  resetTimer() {
    clearInterval(this.countdown);
    this.timer = this.startTime;
  }

  ngOnDestroy(): void {
    this.resetTimer();
  }
}
