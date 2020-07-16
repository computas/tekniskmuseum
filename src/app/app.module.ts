import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { HighScoreModule } from './highscore/highscore.module';
import { IdleDialogComponent } from './idle-dialog/idle-dialog.component';

@NgModule({
  declarations: [AppComponent, IdleDialogComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, WelcomeModule, GameModule, HighScoreModule],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
