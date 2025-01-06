import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {MessageService} from "primeng/api";
import {AuthenticateTokenService} from "../../domains/auth/authenticate-token.service";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthenticateTokenService,
        private messageService: MessageService,
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.auth.getToken();

        // Lista de rotas públicas
        const publicRoutes = ['/auth/login', '/user'];

        // Verificar se a rota é pública
        const isPublicRoute = publicRoutes.some(route => request.url.includes(route));

        // Adicionar token apenas em rotas protegidas
        if (token && !isPublicRoute) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // Verificar validade do token e redirecionar se necessário
        if (this.auth.isAccessTokenInvalido() && !isPublicRoute) {
            this.messageService.add({ severity: 'warn', summary: 'Sessão Expirada', detail: 'Por favor, faça login novamente.' });
            this.auth.limparToken();
            this.router.navigate(['/auth/login']);
        }

        // if (token) {
        //     request = request.clone({
        //         setHeaders: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     });
        // }
        //
        // if (this.auth.isAccessTokenInvalido()) {
        //     console.log('Token inválido. limpando.');
        //     this.auth.limparToken();
        //     this.router.navigate(['/auth/login']);
        // }

        return next.handle(request).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        console.log(`Erro 401: ${err.message}`);
                        this.router.navigate(['/auth/login']);
                    } else {
                        console.log(`Erro HTTP (${err.status}): ${err.message}`);
                    }
                } else {
                    console.log(`Erro não HTTP: ${err.message}`);
                }

                return throwError(() => err);
            })
        );
    }
}
