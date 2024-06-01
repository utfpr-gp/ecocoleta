import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserComponent } from './pages/user/user.component';
import { RegisterResidentComponent } from './pages/register-resident/register-resident.component';
import { RegisterWasteCollectorComponent } from './pages/register-waste-collector/register-waste-collector.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AddressComponent } from './pages/address/address.component';
import { AddressListComponent } from './pages/address-list/address-list.component';
import { AddressUpdateComponent } from './pages/address-update/address-update.component';
import { CollectComponent } from './pages/collect/collect.component';

export const routes: Routes = [
  // { path: 'home?????', component: LandPageComponent }, //TODO fazer land page
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/resident', component: RegisterResidentComponent },
  {
    path: 'register/waste-collector',
    component: RegisterWasteCollectorComponent,
  },
  { path: 'home', component: HomeComponent }, // TODO proteger rota
  { path: 'user', component: UserComponent, canActivate: [authGuard] }, //rota protegida
  { path: 'user/:id', component: PerfilComponent, canActivate: [authGuard] }, //rota protegida
  {
    path: 'address/list',
    component: AddressListComponent,
    canActivate: [authGuard],
  }, //TODO proteger rota
  { path: 'address', component: AddressComponent, canActivate: [authGuard] }, //TODO proteger rota
  {
    path: 'address/:id',
    component: AddressUpdateComponent,
    canActivate: [authGuard],
  }, //TODO proteger rota

  { path: 'collect', component: CollectComponent, canActivate: [authGuard] }, //TODO verificar tipo de user???

  { path: '', redirectTo: 'home', pathMatch: 'full' }, // TODO mudar pagina de redirecionamento
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }, //TODO fazer page not found
];
