import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'register', loadChildren: () => import('./user-register/user-register.module').then(m => m.UserRegisterModule) },
        // { path: 'perfil', loadChildren: () => import('./user-register/user-register.module').then(m => m.UserRegisterModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UserRoutingModule { }
