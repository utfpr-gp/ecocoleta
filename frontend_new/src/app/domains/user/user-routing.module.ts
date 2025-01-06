import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {PerfilComponent} from "./perfil/perfil.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'register', loadChildren: () => import('./user-register/user-register.module').then(m => m.UserRegisterModule) },
        // { path: 'perfil', component: PerfilComponent },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UserRoutingModule { }
