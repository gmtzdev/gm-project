import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';

// PrimeNg
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; 


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([SpinnerInterceptor])
    ),
    importProvidersFrom([BrowserModule, BrowserAnimationsModule]),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};
