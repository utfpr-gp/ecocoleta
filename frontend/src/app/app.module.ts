import {NgModule, isDevMode} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutModule} from './layout/app.layout.module';
import {NotfoundComponent} from './shared-components/notfound/notfound.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./core/interceptors/token.interceptor";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AuthModule} from "./domains/auth/auth.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {JwtModule} from "@auth0/angular-jwt";
import {MessageService} from "primeng/api";
import { GoogleMapsModule } from '@angular/google-maps';
import {ToastModule} from "primeng/toast";
import {IConfig, NgxMaskModule} from "ngx-mask";
import { ServiceWorkerModule } from '@angular/service-worker';

const maskConfig: Partial<IConfig> = {
    validation: true,
};

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

export function tokenGetter(): string {
    return localStorage.getItem('token')!;
}

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AuthModule,
        GoogleMapsModule,
        JwtModule.forRoot(
            {
                config: {
                    tokenGetter,
                    // allowedDomains: [environment.domain],
                }
            }),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ToastModule,
        NgxMaskModule.forRoot(maskConfig),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {provide: LocationStrategy, useClass: PathLocationStrategy}, MessageService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
