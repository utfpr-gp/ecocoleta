import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthGuard} from './core/guards/auth.guard';
import {NotfoundComponent} from './shared_components/notfound/notfound.component';
import {AppLayoutComponent} from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            // {
            // path: '', component: AppLayoutComponent,
            // children: [
            //     { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
            //     { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
            //     { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
            //     { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
            //     { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
            //     { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
            // ]
            // },

            { path: '', redirectTo: 'landing', pathMatch: 'full' },
            {
                path: 'landing',
                loadChildren: () =>
                    import('./domains/landing/landing.module').then(m => m.LandingModule),
            },
            {
                path: 'home',
                canActivate: [AuthGuard],  // O guard está sendo aplicado aqui
                component: AppLayoutComponent, // Rota protegida
                // children: [
                //     { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                //     // Outras rotas...
                // ]
            },
            {path: 'user', loadChildren: () => import('./domains/user/user.module').then(m => m.UserModule)},
            {path: 'auth', loadChildren: () => import('./domains/auth/auth.module').then(m => m.AuthModule)},
            {path: 'notfound', component: NotfoundComponent},
            {path: '**', redirectTo: '/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
