import { Component, input, Input, OnInit } from '@angular/core';
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
  @Input() title: string = 'EcoColeta';
  @Input() subTitle!: string;
  hasNotification: boolean = true;
  // userLoggedRole!: UserRole;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.returnUser().subscribe((user) => {
      this.userLogged = user;
      // this.userLoggedRole = user?.role as UserRole;
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
