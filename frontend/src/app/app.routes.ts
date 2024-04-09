import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RegisterResidentComponent } from './pages/register-resident/register-resident.component';
import { RegisterWasteCollectorComponent } from './pages/register-waste-collector/register-waste-collector.component';

export const routes: Routes = [
  // { path: 'home', component: LandPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/resident', component: RegisterResidentComponent },
  {
    path: 'register/waste-collector',
    component: RegisterWasteCollectorComponent,
  },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService] },

  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent },
];
