import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
