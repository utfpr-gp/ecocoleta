import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/types/user.type';
import { Token } from '../../core/types/token.type';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() logged: boolean = false;

  // ngOnInit(): void {}

  // logged: boolean = false;
  // // tokenDecode: Token | null = null;
  constructor(private userService: UserService, private router: Router) {
    // this.logged = this.userService.isLogged();
  }
  // // tokenDecode$ = this.userService.returnUser();
  logout() {
    this.logged = false;
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
