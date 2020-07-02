import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { DrawingModule } from './drawing/drawing.module';
import { GameInfoModule } from './game-info/game-info.module';
import { ResultModule } from './result/result.module';
import { ResultComponent } from './result/result.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    WelcomeModule,
    DrawingModule,
    GameInfoModule,
    ResultModule,
  ],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
