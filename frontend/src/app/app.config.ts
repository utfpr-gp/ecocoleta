import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authenticationInterceptor } from './core/interceptors/authentication.interceptor';

export const appConfig: ApplicationConfig = {
  //injetando httpClient, ngx-toastr, Animations em toda aplicação
  providers: [
    //provendo o token se existir em todas as requisição assim não precisando passar explicitamente no header de cada requisição
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authenticationInterceptor,
      multi: true,
    },
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideHttpClient(withFetch()),
  ],
};

//TODO verificar interceptação não esta enviando o header authorization
