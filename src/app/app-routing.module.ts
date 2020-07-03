import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';
import { ResultComponent } from './result/result.component';
import { routes as r } from './shared/models/routes';
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
    path: r.RESULT,
    component: ResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
