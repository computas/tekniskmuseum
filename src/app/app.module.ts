import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, IdleTimeoutDialog } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { HighScoreModule } from './highscore/highscore.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, WelcomeModule, GameModule, HighScoreModule, MatDialogModule],
  providers: [HttpClientModule, IdleTimeoutDialog],
  bootstrap: [AppComponent],
})
export class AppModule { }
