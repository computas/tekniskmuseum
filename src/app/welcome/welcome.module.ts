import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [CommonModule, MaterialImportsModule, RouterModule, WelcomeComponent],
})
export class WelcomeModule {}
