import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { LobbyComponent } from './lobby/lobby.component';
import { MultiplayerComponent } from './multiplayer.component';
import { AppRoutingModule } from '../app-routing.module';
import { GameModule } from '../game/game.module';

@NgModule({
  declarations: [LobbyComponent, MultiplayerComponent],
  imports: [CommonModule, MaterialImportsModule, AppRoutingModule, GameModule],
})
export class MultiplayerModule {}
