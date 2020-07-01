import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { GameInfoComponent } from './game-info.component';

@NgModule({
  declarations: [GameInfoComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class GameInfoModule { }
