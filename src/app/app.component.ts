import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IdleTimeoutComponent } from './idle-timeout/idle-timeout.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Teknisk Museum';

  userActivity;
  userInactive: Subject<any> = new Subject();

  isDialogOpen = false;
  inactivityTime = 0.5 * 1000;

  // constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router, public dialog: MatDialog) {
  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.setDialogTimeout();
    this.userInactive.subscribe(() => {
      if (this.router.url !== '/') {
        this.openDialog();
      }
    });
  }

  openDialog() {
    if (!this.isDialogOpen) {
      this.dialog
        .open(IdleTimeoutComponent)
        .afterClosed()
        .subscribe(() => {
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

// @Component({
//   selector: 'app-idle-timeout-dialog',
//   templateUrl: 'idle-timeout-dialog.html',
//   styleUrls: ['./idle-timeout-dialog.scss'],

// })
// export class IdleTimeoutDialogComponent implements OnInit, OnDestroy {
//   constructor(private router: Router, private dialogRef: MatDialogRef<IdleTimeoutDialogComponent>) { }

//   startTime = 15;
//   timer;
//   countdown;

//   ngOnInit(): void {
//     this.timer = this.startTime;
//     this.countdown = setInterval(() => {
//       this.timer -= 1;
//       if (this.timer === 0) {
//         this.resetTimer();
//         this.goHome();
//       }
//     }, 1000);
//   }

//   goHome() {
//     this.closeDialog();
//     this.router.navigateByUrl('');
//   }

//   closeDialog() {
//     clearInterval(this.countdown);
//     this.dialogRef.close();
//   }

//   resetTimer() {
//     clearInterval(this.countdown);
//     this.timer = this.startTime;
//   }

//   ngOnDestroy(): void {
//     this.resetTimer();
//   }
// }
