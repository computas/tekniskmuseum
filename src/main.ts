import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MaterialImportsModule } from './app/shared/material-imports/material-imports.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MultiplayerModule } from './app/game/game-multiplayer/multiplayer.module';
import { GameModule } from './app/game/game.module';
import { WelcomeModule } from './app/welcome/welcome.module';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AuthGuard } from './app/admin/auth-guard';
import { InfoDialogComponent } from './app/admin/info-dialog/info-dialog.component';
import { HttpClientModule, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, WelcomeModule, GameModule, MultiplayerModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }), MatSnackBarModule, MatDialogModule, MaterialImportsModule, CommonModule),
        HttpClientModule, InfoDialogComponent, AuthGuard, { provide: MAT_DIALOG_DATA, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ]
})
  .catch((err) => console.error(err));
