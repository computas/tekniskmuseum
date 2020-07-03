import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameInfoComponent } from './game-info/game-info.component';
import { GameStepComponent } from './game-step/game-step.component';
import { GameDrawComponent } from './game-draw/game-draw.component';
import { GameComponent } from './game.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
@NgModule({
  declarations: [
    GameInfoComponent,
    GameStepComponent,
    GameDrawComponent,
    GameComponent,
  ],
  imports: [CommonModule, MaterialImportsModule],
})
export class GameModule {}
