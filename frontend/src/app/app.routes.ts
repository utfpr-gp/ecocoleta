import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserComponent } from './pages/user/user.component';
import { RegisterResidentComponent } from './pages/register-resident/register-resident.component';
import { RegisterWasteCollectorComponent } from './pages/register-waste-collector/register-waste-collector.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // { path: 'home', component: LandPageComponent }, //TODO fazer land page
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/resident', component: RegisterResidentComponent },
  {
    path: 'register/waste-collector',
    component: RegisterWasteCollectorComponent,
  },
  { path: 'user', component: UserComponent, canActivate: [authGuard] }, //rota protegida
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }, //TODO fazer page not found
];
