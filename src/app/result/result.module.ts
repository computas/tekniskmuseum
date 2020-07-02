import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ResultComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule],
})
export class ResultModule {}
