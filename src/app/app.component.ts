import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { routeTransitionAnimations } from './route-transition-animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
})
export class AppComponent {
  title = 'Teknisk Museum';

  prepareRoute(outlet: RouterOutlet) {
    const animationState = 'animationState';
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData[animationState];
  }
}
