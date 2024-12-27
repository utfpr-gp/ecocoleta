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
import {AuthenticateService} from "../../domains/auth/authenticate.service";
import {Router} from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthenticateService,
        private messageService: MessageService,
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.auth.getToken();

        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        if (this.auth.isAccessTokenInvalido()) {
            this.router.navigate(['/auth/login']);
        }

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
