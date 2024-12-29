import {Component, Output} from '@angular/core';
import {UserRole, UserService} from "../user.service";

@Component({
    selector: 'app-access',
    templateUrl: './user-register.component.html',
})
export class UserRegisterComponent {

    showModal = true;
    @Output() userType: UserRole | null = null;
    protected readonly UserRole = UserRole;

    constructor(private userService: UserService) {
    }

    selectUserType(type: UserRole) {
        this.userType = type;
        this.showModal = false;

        console.log("tipo de user :: " + type ) //todo remover
    }
}
