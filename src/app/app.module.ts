import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeModule } from './welcome/welcome.module';
import { GameModule } from './game/game.module';
import { MultiplayerModule } from '../app/game/game-multiplayer/multiplayer.module';
import { environment } from '../environments/environment';
import { MaterialImportsModule } from './shared/material-imports/material-imports.module';
import { IdleTimeoutComponent } from './idle-timeout/idle-timeout.component';
import { AdminComponent } from './admin/admin.component';
import { InfoComponent } from './admin/info/info.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { InfoDialogComponent } from './admin/info-dialog/info-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthGuard } from './admin/auth-guard';
import { DialogTemplateComponent } from './admin/dialog-template/dialog-template.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    InfoComponent,
    IdleTimeoutComponent,
    InfoDialogComponent,
    DialogTemplateComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    WelcomeModule,
    GameModule,
    MultiplayerModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatSnackBarModule,
    MatDialogModule,
    MaterialImportsModule,
    BrowserAnimationsModule,
  ],
  providers: [HttpClientModule, InfoDialogComponent, AuthGuard, { provide: MAT_DIALOG_DATA, useValue: {} }],

  bootstrap: [AppComponent],
})
export class AppModule {}
