import { Routes } from '@angular/router';
import { SplashComponent } from './splash/splash.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { routes as r } from './shared/models/routes';
import { GameResultComponent } from './game/game-result/game-result.component';
import { GameDrawComponent } from './game/game-draw/game-draw.component';
import { AdminComponent } from './admin/admin.component';
import { InfoComponent } from './admin/info/info.component';
import { authGuard } from './admin/auth-guard';
import { MultiplayerComponent } from './game/game-multiplayer/multiplayer.component';

export const routes: Routes = [
  {
    path: '',
    component: SplashComponent,
    data: { animationState: 'splash' },
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    data: { animationState: 'welcome' },
  },
  {
    path: r.SINGLEPLAYER,
    component: GameComponent,
    data: { animationState: 'game' },
  },
  {
    path: r.MULTIPLAYER,
    component: MultiplayerComponent,
  },
  {
    path: 'summary',
    component: GameResultComponent,
  },
  {
    path: 'summary/multiplayer',
    component: GameResultComponent,
  },
  {
    path: 'drawing',
    component: GameDrawComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
  {
    path: 'admin/info',
    component: InfoComponent,
    canActivate: [authGuard],
  },
];
