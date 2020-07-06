import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [CommonModule, MaterialImportsModule],
})
export class WelcomeModule {}
