import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { routes } from './app/routes';
import { bootstrapApplication } from '@angular/platform-browser';
import { InfoDialogComponent } from './app/admin/info-dialog/info-dialog.component';
import { withInterceptorsFromDi, provideHttpClient, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslationService } from './app/services/translation.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })),
    InfoDialogComponent,
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClient),
    TranslationService
  ],
}).catch((err) => console.error(err));
