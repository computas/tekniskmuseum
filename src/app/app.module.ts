import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeModule } from './welcome/welcome.module';
import { DrawingModule } from './drawing/drawing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    WelcomeModule,
    DrawingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
