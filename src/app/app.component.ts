import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';

import { IdleTimeoutComponent } from './game/idle-timeout/idle-timeout.component';
import { routeTransitionAnimations } from './route-transition-animations';
import { environment } from '../environments/environment';
import { GameStateService } from './game/services/game-state-service';
import { GAMESTATE } from './shared/models/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'Teknisk Museum';

  userActivity = 0;
  userInactive = new Subject<boolean | undefined>();

  isDialogOpen = false;
  inactivityTime = environment.inactivityTime;
  hasResetForIntermediateResult = false; //Idle timer should reset only once when entering intermediateResult page.

  constructor(private gameStateService: GameStateService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.setDialogTimeout();
    this.gameStateService.currentPage$.subscribe(currentPage => {
      if (currentPage !== GAMESTATE.intermediateResult && this.hasResetForIntermediateResult) {
        this.hasResetForIntermediateResult = false;
      }

    })
    this.userInactive.subscribe(() => { 
      if (this.gameStateService.getCurrentPage() === GAMESTATE.drawingBoard) {
        clearTimeout(this.userActivity);
        this.setDialogTimeout();
        return;
      }
      
      if (this.gameStateService.getCurrentPage() === GAMESTATE.intermediateResult && !this.hasResetForIntermediateResult) {
        clearTimeout(this.userActivity);
        this.setDialogTimeout();
        this.hasResetForIntermediateResult = true;
        return;
      }

      if (this.router.url === '/welcome') {
        this.router.navigate(['/']);
      } else if (this.router.url !== '/' && this.router.url !== '/admin') {
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
    this.userActivity = window.setTimeout(() => this.userInactive.next(undefined), this.inactivityTime);
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

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }

  @HostListener('gesturestart', ['$event'])
  onGestureStart(event: Event): void {
    event.preventDefault();
  }

  @HostListener('gesturechange', ['$event'])
  onGestureChange(event: Event): void {
    event.preventDefault();
  }

  @HostListener('gestureend', ['$event'])
  onGestureEnd(event: Event): void {
    event.preventDefault();
  }
}
