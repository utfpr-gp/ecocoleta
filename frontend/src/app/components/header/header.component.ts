import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/types/user.type';
import { Token } from '../../core/types/token.type';
import { UserRole } from '../../core/types/user-role.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userLogged: User | null = null;
  // userLoggedRole!: UserRole;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.returnUser().subscribe((user) => {
      this.userLogged = user;
      // this.userLoggedRole = user?.role as UserRole;
    });

    console.log('user log header> ', this.userLogged); //TODO apagar apos teste
    // console.log('user log role> ', this.userLoggedRole); //TODO apagar apos teste
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
