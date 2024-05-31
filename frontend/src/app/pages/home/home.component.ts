import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HomeDefaultComponent } from '../../components/home-default/home-default.component';
import { User } from '../../core/types/user.type';
import { UserService } from '../../core/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ButtonLargerGreenComponent } from '../../components/button-larger-green/button-larger-green.component';
import { HomeResidentCollectionsHistoryComponent } from '../../components/home-resident-collections-history/home-resident-collections-history.component';
import { HomeResidentCollectionsProgressComponent } from '../../components/home-resident-collections-progress/home-resident-collections-progress.component';
//TODO verifica rocmo faz a injeção dos componentes em tempo de execução
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    HomeDefaultComponent,
    HomeResidentCollectionsProgressComponent,
    HomeResidentCollectionsHistoryComponent,
    ButtonLargerGreenComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  userLogged: User | null = null;
  activeButtonIndex: number = 0; //butto 0 ninitially active
  @ViewChild('containerRef', { read: ViewContainerRef })
  containerRef!: ViewContainerRef;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.returnUser().subscribe((user) => {
      this.userLogged = user;
    });
  }

  ngAfterViewInit(): void {
    // Set the initial active button after the view has been initialized
    this.setActiveButton(this.activeButtonIndex);
    // Get the main component based on the initial active button
    this.getMainComponent(this.activeButtonIndex);
  }

  changeClickedButton(event: Event, index: number): void {
    console.log('clicou changeClickedButton', index);
    const element = event.target as HTMLElement;

    // Remove 'clicked' class from previously active button
    if (this.activeButtonIndex !== null) {
      const previousActiveButton = document.querySelector(
        `.btn-${this.activeButtonIndex}`
      );
      if (previousActiveButton) {
        previousActiveButton.classList.remove('clicked');
      }
    }

    // Add 'clicked' class to the currently clicked button
    element.classList.add('clicked');
    this.activeButtonIndex = index;

    // Get the main component based on the clicked button
    this.getMainComponent(index);
  }

  private setActiveButton(index: number | null): void {
    if (index !== null) {
      const initialActiveButton = document.querySelector(`.btn-${index}`);
      if (initialActiveButton) {
        initialActiveButton.classList.add('clicked');
      }
    }
  }

  getMainComponent(index: number): void {
    console.log('getMainComponent', index);
    this.containerRef.clear();
    index === 0
      ? this.containerRef.createComponent(
          HomeResidentCollectionsProgressComponent
        )
      : this.containerRef.createComponent(
          HomeResidentCollectionsHistoryComponent
        );
    // this.containerRef.createComponent(HomeResidentCollectionsProgressComponent);
  }
}
