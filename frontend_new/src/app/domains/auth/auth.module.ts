import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {JwtHelperService} from "@auth0/angular-jwt";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {DividerModule} from "primeng/divider";
import {ToastModule} from "primeng/toast";
import {InputMaskModule} from "primeng/inputmask";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthenticationInterceptor} from "../../core/interceptors/authentication.interceptor";
import {AuthGuard} from "../../core/guards/auth.guard";
import {LoginComponent} from "./login/login.component";

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        FormsModule,
        AuthRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        RippleModule,
        DialogModule,
        ReactiveFormsModule,
        DividerModule,
        ToastModule,
        // SharedModule,
        InputMaskModule
    ],
    providers: [
        JwtHelperService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        },
        AuthGuard
    ]
})
export class AuthModule { }
