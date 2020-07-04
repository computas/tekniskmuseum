import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameInfoComponent } from './game-info/game-info.component';
import { GameDrawComponent } from './game-draw/game-draw.component';
import { GameComponent } from './game.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { GameIntermediateResultComponent } from './game-intermediate-result/game-intermediate-result.component';
import { GameResultComponent } from './game-result/game-result.component';
@NgModule({
  declarations: [GameInfoComponent, GameDrawComponent, GameComponent, GameIntermediateResultComponent, GameResultComponent],
  imports: [CommonModule, MaterialImportsModule],
})
export class GameModule {}
