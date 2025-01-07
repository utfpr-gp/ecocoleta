import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './core/guards/auth.guard';
import {NotfoundComponent} from './shared_components/notfound/notfound.component';
import {AppLayoutComponent} from "./layout/app.layout.component";
import {PerfilComponent} from "./domains/user/perfil/perfil.component";
import {ResidentComponent} from "./domains/home/resident/resident.component";
import {WasteCollectorComponent} from "./domains/home/waste-collector/waste-collector.component";
import {AdminHomeComponent} from "./domains/home/admin-home/admin-home.component";
import {NotificacoesComponent} from "./domains/user/notificacoes/notificacoes.component";
import {ColetasComponent} from "./domains/home/coletas/coletas.component";
import {ColetasHistoricoComponent} from "./domains/home/coletas-historico/coletas-historico.component";

// @NgModule({
//     imports: [
//         RouterModule.forRoot([
//             { path: '', redirectTo: 'landing', pathMatch: 'full' },
//             {
//                 path: 'landing',
//                 loadChildren: () =>
//                     import('./domains/landing/landing.module').then(m => m.LandingModule),
//             },
//             {
//                 path: 'home',
//                 canActivate: [AuthGuard],  // O guard está sendo aplicado aqui
//                 component: AppLayoutComponent, // Rota protegida
//                 //TODO verificar tipo de user e direcionar para pagians especificas
//                 // caso seja resident: mapa com catadores em atividade
//                 // caso seja catador: mapa com pontos de coleta ativos
//
//                 // TODO rota perfil do user
//
//                 children: [
//                     //modulos
//                     // { path: 'userperfil', loadChildren: () => import('./domains/user/perfil/perfil.component').then(c => c.PerfilComponent) },
//                     //components1
//                     { path: 'userperfil', component: PerfilComponent },
//                     // Outras rotas...
//                 ]
//             },
//             {path: 'user', loadChildren: () => import('./domains/user/user.module').then(m => m.UserModule)},
//             {path: 'auth', loadChildren: () => import('./domains/auth/auth.module').then(m => m.AuthModule)},
//             {path: 'notfound', component: NotfoundComponent},
//             {path: '**', redirectTo: '/notfound'},
//         ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})
//     ],
//     exports: [RouterModule]
// })
// export class AppRoutingModule {
// }
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
                path: 'home', // Rotas protegidas
                canActivate: [AuthGuard],
                component: AppLayoutComponent,
                children: [
                    {path: '', redirectTo: 'resident', pathMatch: 'full'}, // Redireciona padrão
                    {
                        path: 'resident',
                        component: ResidentComponent,
                        canActivate: [AuthGuard],
                        data: {role: 'RESIDENT'}
                    },
                    {
                        path: 'waste',
                        component: WasteCollectorComponent,
                        canActivate: [AuthGuard],
                        data: {role: 'WASTE_COLLECTOR'}
                    },
                    {
                        path: 'admin',
                        component: AdminHomeComponent,
                        canActivate: [AuthGuard],
                        data: {role: 'ADMIN'}
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
            {
                path: 'user',
                loadChildren: () => import('./domains/user/user.module').then(m => m.UserModule),
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
