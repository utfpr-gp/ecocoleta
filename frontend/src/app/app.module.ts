import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './layout/menu/menu.component';
import { LoginComponent } from './login/login.component';
import { NgxMaskModule } from 'ngx-mask';
import { FooterBtnNavComponent } from './layout/footer-btn-nav/footer-btn-nav.component';
import { FooterCommonComponent } from './layout/footer-common/footer-common.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LandPageComponent } from './land-page/land-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    FooterBtnNavComponent,
    FooterCommonComponent,
    PageNotFoundComponent,
    LandPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // NgxMaskModule.forRoot ,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
