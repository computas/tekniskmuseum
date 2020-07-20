import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialImportsModule } from '../shared/material-imports/material-imports.module';
import { RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';

@NgModule({
  declarations: [LobbyComponent],
  imports: [CommonModule, MaterialImportsModule, RouterModule],
})
export class MultiplayerModule {}
