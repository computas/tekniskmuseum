import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { HighscoreComponent } from './highscore/highscore.component';
import { HighscoreSideNavComponent } from './highscore/highscore-side-nav/highscore-side-nav.component';

@NgModule({
  declarations: [AppComponent, HighscoreComponent, HighscoreSideNavComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, WelcomeModule, GameModule],
  providers: [HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
