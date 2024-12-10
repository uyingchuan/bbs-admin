import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { PlatformLocation, registerLocaleData } from '@angular/common';
import { ApiInterceptor } from '@interceptors/request.interceptor';
import { RouteStrategyService } from '@services/route-strategy.service';
import { translateLoaderFactory } from '@utils/translate.loader';
import localeCN from '@angular/common/locales/zh';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

registerLocaleData(localeCN);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: RouteStrategyService, useExisting: RouteStrategyService },
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient, PlatformLocation],
        },
      }),
    ]),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
