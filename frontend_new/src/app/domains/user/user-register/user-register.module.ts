import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { UserRegisterRoutingModule } from './user-register-routing.module';
import { UserRegisterComponent } from './user-register.component';
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DialogModule} from "primeng/dialog";
import {PanelModule} from "primeng/panel";
import {MessageComponent} from "../../../shared_components/message.component";
import {UserFormComponent} from "../../../shared_components/user-form/user-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";

@NgModule({
    imports: [
        CommonModule,
        UserRegisterRoutingModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
        PanelModule,
        MessageComponent,
        UserFormComponent,
        ReactiveFormsModule,
        ToastModule
    ],
    declarations: [UserRegisterComponent]
})
export class UserRegisterModule { }
