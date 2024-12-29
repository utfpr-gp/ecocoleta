import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRegisterComponent } from './user-register.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: UserRegisterComponent }
    ])],
    exports: [RouterModule]
})
export class UserRegisterRoutingModule { }
