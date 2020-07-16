import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Teknisk Museum';

  userActivity;
  userInactive: Subject<any> = new Subject();

  isDialogOpen = false;
  inactivityTime = 5 * 1000;

  constructor(private router: Router, public dialog: MatDialog) {
    console.log(this.router.url);
    this.setDialogTimeout();

    this.userInactive.subscribe(() => {
      if (this.router.url != '/') {
        this.openDialog();
      }
    });
  }

  openDialog() {
    if (!this.isDialogOpen) {
      this.dialog.open(IdleTimeoutDialog).afterClosed().subscribe(() => {
        this.isDialogOpen = false;
      });

      this.isDialogOpen = true;
    }
  }

  setDialogTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), this.inactivityTime);
  }

  @HostListener('window:mousemove')
  @HostListener('document:touchmove')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setDialogTimeout();
  }
}

@Component({
  selector: 'idle-timeout-dialog',
  templateUrl: 'idle-timeout-dialog.html',
})
export class IdleTimeoutDialog implements OnInit {

  constructor(private router: Router, private dialogRef: MatDialogRef<IdleTimeoutDialog>) { }

  startTime = 15;
  timer;
  countdown;

  ngOnInit(): void {
    this.timer = this.startTime;
    this.countdown = setInterval(() => {
      this.timer -= 1;
      if (this.timer === 0) {
        this.timer = this.startTime;
        this.goHome();
        clearInterval(this.countdown);
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
}