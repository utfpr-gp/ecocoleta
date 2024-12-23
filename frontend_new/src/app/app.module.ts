import {NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppLayoutModule} from './layout/app.layout.module';
import {NotfoundComponent} from './demo_apagar/components/notfound/notfound.component';
import {ProductService} from './demo_apagar/service/product.service';
import {CountryService} from './demo_apagar/service/country.service';
import {CustomerService} from './demo_apagar/service/customer.service';
import {EventService} from './demo_apagar/service/event.service';
import {IconService} from './demo_apagar/service/icon.service';
import {NodeService} from './demo_apagar/service/node.service';
import {PhotoService} from './demo_apagar/service/photo.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AuthenticationInterceptor} from "./core/interceptors/authentication.interceptor";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AuthModule} from "./domains/auth/auth.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {JwtModule} from "@auth0/angular-jwt";

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
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        },
        {provide: LocationStrategy, useClass: PathLocationStrategy},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
