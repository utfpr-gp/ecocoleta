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

        // Verifique se o token existe antes de adicionar ao cabeçalho
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        // Continue com a requisição
        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    // Se o erro for 401 (Token expirado ou inválido), limpa o token e redireciona
                    console.log('Token inválido ou expirado.');
                    this.auth.limparToken();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Sessão Expirada',
                        detail: 'Por favor, faça login novamente.',
                    });
                    this.router.navigate(['/auth/login']);
                } else {
                    console.error(`Erro HTTP (${err.status}): ${err.message}`);
                }
                return throwError(() => err);
            })
        );
    }
}
