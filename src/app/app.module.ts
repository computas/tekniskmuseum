import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, IdleTimeoutDialogComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { HighScoreModule } from './highscore/highscore.module';
import { IdleTimeoutComponent } from './idle-timeout/idle-timeout.component';

@NgModule({
  declarations: [AppComponent, IdleTimeoutComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    WelcomeModule,
    GameModule,
    HighScoreModule,
    MatDialogModule,
  ],
  providers: [HttpClientModule, IdleTimeoutDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
