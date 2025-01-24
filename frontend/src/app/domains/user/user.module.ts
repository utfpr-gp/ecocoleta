import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {ToastModule} from "primeng/toast";
import {InputMaskModule} from "primeng/inputmask";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        DialogModule,
        ReactiveFormsModule,
        DividerModule,
        ToastModule,
        InputMaskModule
    ]
})
export class UserModule { }
