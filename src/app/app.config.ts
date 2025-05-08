import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideDataConnect, getDataConnect } from '@angular/fire/data-connect';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { connectorConfig } from '@firebasegen/default-connector';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
  importProvidersFrom(ToastrModule.forRoot()),
    provideHttpClient(),
    // ✅ Only ONE Firebase initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    {provide:FIREBASE_OPTIONS, useValue:environment.firebase},
    // ✅ Modular providers
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideDataConnect(() => getDataConnect(connectorConfig)),

    // TanStack Query
    provideTanStackQuery(new QueryClient()),

    // Angular Router
    provideRouter(routes),

    // Optional: Angular Zone performance
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};
function provideToastr(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

