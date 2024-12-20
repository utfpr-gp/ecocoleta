import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo_apagar/components/notfound/notfound.component';
import { ProductService } from './demo_apagar/service/product.service';
import { CountryService } from './demo_apagar/service/country.service';
import { CustomerService } from './demo_apagar/service/customer.service';
import { EventService } from './demo_apagar/service/event.service';
import { IconService } from './demo_apagar/service/icon.service';
import { NodeService } from './demo_apagar/service/node.service';
import { PhotoService } from './demo_apagar/service/photo.service';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
