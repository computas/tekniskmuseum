import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawingComponent } from './drawing.component';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [DrawingComponent],
  imports: [CommonModule, MatButtonModule, MatToolbarModule],
})
export class DrawingModule {}
