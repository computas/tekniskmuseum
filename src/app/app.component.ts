import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

import { IdleTimeoutComponent } from './idle-timeout/idle-timeout.component';
import { routeTransitionAnimations } from './route-transition-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
})
export class AppComponent implements OnInit {
  title = 'Teknisk Museum';

  userActivity;
  userInactive: Subject<any> = new Subject();

  isDialogOpen = false;
  inactivityTime = 30 * 1000;

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

  prepareRoute(outlet: RouterOutlet) {
    const animationState = 'animationState';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[animationState];
  }

  @HostListener('window:mousemove')
  @HostListener('document:touchmove')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setDialogTimeout();
  }
}
