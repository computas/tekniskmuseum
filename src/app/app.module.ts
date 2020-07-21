import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { HighScoreModule } from './highscore/highscore.module';
import { IdleTimeoutComponent } from './idle-timeout/idle-timeout.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, WelcomeModule, GameModule, HighScoreModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), IdleTimeoutComponent],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule { }
