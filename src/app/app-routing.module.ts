import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { routes as r } from './shared/models/routes';
import { HighscoreComponent } from './highscore/highscore.component';
const routes: Routes = [
  {
    path: r.LANDING,
    component: WelcomeComponent,
  },
  {
    path: r.PLAYGAME,
    component: GameComponent,
  },
  {
    path: r.HIGHSCORE,
    component: HighscoreComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
