import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

@NgModule({
  declarations: [ResultComponent],
  imports: [CommonModule, MaterialImportsModule],
})
export class ResultModule {}
