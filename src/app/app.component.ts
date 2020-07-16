import { Component, HostListener } from '@angular/core';
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

  constructor(private router: Router, public dialog: MatDialog) {
    console.log(this.router.url);
    this.setDialogTimeout();

    this.userInactive.subscribe(() => {
      if (this.router.url != '/') {
        // alert("timeout");
        // this.router.navigateByUrl('');
        this.openDialog();
        console.log(this.router.url, "inaktiv");
        setTimeout(() => console.log(this.router.url, "starter igjen"), 1500);

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
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 3000);
  }

  //legge til dersom bilde endrer seg? ?
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
export class IdleTimeoutDialog {

  constructor(private router: Router, private dialogRef: MatDialogRef<IdleTimeoutDialog>) { }

  goHome() {
    this.closeDialog();
    this.router.navigateByUrl('');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}