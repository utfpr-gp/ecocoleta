import { Component, input, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/types/user.type';

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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.returnUser().subscribe((user) => {
      this.userLogged = user;
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
