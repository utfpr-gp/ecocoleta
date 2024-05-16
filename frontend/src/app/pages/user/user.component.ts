import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // this.userService.getUser().subscribe((response) => {
    //   console.log(response);
    // });
    // throw new Error('Method not implemented.');
  }
}
