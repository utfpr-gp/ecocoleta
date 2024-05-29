import { Component, OnInit } from '@angular/core';
import { User } from '../../core/types/user.type';
import { UserService } from '../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  userLogged: User | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.returnUser().subscribe((user) => {
      this.userLogged = user;
    });
  }
}
