import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighScoreComponent } from './highscore.component';
import { HighScoreSideNavComponent } from './highscore-side-nav/highscore-side-nav.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

@NgModule({
  declarations: [HighScoreComponent, HighScoreSideNavComponent],
  imports: [CommonModule, MaterialImportsModule],
})
export class HighScoreModule {}
