import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { routes as r } from './shared/models/routes';
import { GameResultComponent } from './game/game-result/game-result.component';
import { GameDrawComponent } from './game/game-draw/game-draw.component';
import { AdminComponent } from './admin/admin.component';
import { InfoComponent } from './admin/info/info.component';
import { AuthGuard } from './admin/auth-guard';
import { MultiplayerComponent } from '../app/game/game-multiplayer/multiplayer.component';

const routes: Routes = [
  {
    path: r.LANDING,
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
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
