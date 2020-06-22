import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { DrawingComponent } from './drawing/drawing.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'drawing',
    component: DrawingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
