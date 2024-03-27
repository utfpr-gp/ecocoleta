import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  // { path: 'home', component: LandPageComponent },
  { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
