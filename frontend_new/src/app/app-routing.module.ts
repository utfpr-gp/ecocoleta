import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './core/guards/auth.guard';
import {NotfoundComponent} from './shared_components/notfound/notfound.component';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {PerfilComponent} from "./domains/user/perfil/perfil.component";
import {HomeComponent} from "./domains/home/home.component";
import {NotificacoesComponent} from "./domains/user/notificacoes/notificacoes.component";
import {ColetasComponent} from "./domains/coletas/coletas.component";
import {ColetasHistoricoComponent} from "./domains/coletas-historico/coletas-historico.component";
import {UserRegisterComponent} from "./domains/user/user-register/user-register.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'landing',
                pathMatch: 'full', // Redireciona para /landing se não autenticado
            },
            {
                path: 'landing',
                loadChildren: () => import('./domains/landing/landing.module').then(m => m.LandingModule),
            },
            {
                path: '', // Rotas protegidas
                canActivate: [AuthGuard],
                component: AppLayoutComponent,
                children: [
                    {
                        path: 'home',
                        component: HomeComponent,
                        canActivate: [AuthGuard]
                    },
                    {
                        path: 'coletas',
                        component: ColetasComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'coletas-historico',
                        component: ColetasHistoricoComponent,
                        canActivate: [AuthGuard],
                    },
                    {
                        path: 'user',
                        children: [
                            {
                                path: 'perfil/:user_id',
                                component: PerfilComponent,
                                canActivate: [AuthGuard],
                            },
                            {
                                path: 'notificacoes/:user_id',
                                component: NotificacoesComponent,
                                canActivate: [AuthGuard],
                            },
                        ],
                    },
                ],
            },
            {
                path: 'auth',
                loadChildren: () => import('./domains/auth/auth.module').then(m => m.AuthModule),
            },
            // {
            //     path: 'user',
            //     loadChildren: () => import('./domains/user/user.module').then(m => m.UserModule),
            // },
            {
                path: 'user-register',
                component: UserRegisterComponent,
            },
            {path: 'notfound', component: NotfoundComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
