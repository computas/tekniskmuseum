import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';



import { WelcomeComponent } from './welcome.component';



@NgModule({
  declarations: [WelcomeComponent],
  imports: [
    CommonModule, MatButtonModule, MatSidenavModule, MatListModule, MatIconModule
  ]
})
export class WelcomeModule { }
