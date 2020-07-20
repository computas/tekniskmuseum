import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { HighScoreModule } from './highscore/highscore.module';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { LobbyComponent } from './multiplayer/lobby/lobby.component';

@NgModule({
  declarations: [AppComponent, MultiplayerComponent, LobbyComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, WelcomeModule, GameModule, HighScoreModule],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
