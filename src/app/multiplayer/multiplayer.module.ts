import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { LobbyComponent } from './lobby/lobby.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [LobbyComponent],
  imports: [CommonModule, MaterialImportsModule, AppRoutingModule],
})
export class MultiplayerModule {}
