import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { RouterModule } from '@angular/router';
import { GameModeComponent } from './game-mode.component';

@NgModule({
  declarations: [GameModeComponent],
  imports: [CommonModule, MaterialImportsModule, RouterModule],
})
export class GameModeModule {}
