import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { routes as r } from './shared/models/routes';
import { HighScoreComponent } from './highscore/highscore.component';
import { GameResultComponent } from './game/game-result/game-result.component';
import { GameDrawComponent } from './game/game-draw/game-draw.component';
const routes: Routes = [
  {
    path: r.LANDING,
    component: WelcomeComponent,
    data: { animationState: 'One' }
  },
  {
    path: r.PLAYGAME,
    component: GameComponent,
    data: { animationState: 'Two' }
  },
  {
    path: r.HIGHSCORE,
    component: HighScoreComponent,
  },
  {
    path: 'summary',
    component: GameResultComponent,
  },
  {
    path: 'drawing',
    component: GameDrawComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
