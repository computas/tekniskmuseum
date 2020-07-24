import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IdleTimeoutComponent } from './idle-timeout/idle-timeout.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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

  constructor(private router: Router, public dialog: MatDialog) {}

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

  prepareRoute(outlet: RouterOutlet) {
    const animationState = 'animationState';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[animationState];

  }
}
