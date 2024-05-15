import { Component, Output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
  @Output() logged: boolean = false; //TODO deixar no componente raiz para passar ao header e footer, adaptar par acolocar a hole do user
  // tokenDecode: Token | null = null;

  constructor(private userService: UserService) {
    this.logged = this.userService.isLogged();
  }

  // tokenDecode$ = this.userService.returnUser();

  // logout() {
  //   this.logged = false;
  //   this.userService.logout();
  //   this.router.navigate(['/']);
  // }
}
