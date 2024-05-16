import { Component } from '@angular/core';
import { FormBaseComponent } from '../../components/form-base/form-base.component';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormBaseComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
  formModeUpdate: boolean = true;
  // userRole: string | undefined = 'WASTE_COLLECTOR';

  constructor(private userService: UserService) {
    // console.log('userService.userRole', userService.userRole);
    // this.userService.returnUser().subscribe((user) => {
    //   this.userRole = user?.role;
    //   console.log('user service log> returnUser', user);
    // });
  }

  async updateUser() {}
}
