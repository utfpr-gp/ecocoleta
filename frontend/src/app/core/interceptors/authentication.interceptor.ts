import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private toastrservice: ToastrService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.loginService.existsToken()) {
      const token = this.loginService.getToken();

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          // Handle HTTP errors
          if (err.status === 401) {
            // Specific handling for unauthorized errors
            // this.toastrservice.error(`Erro: ${err.message}`);
            console.log(`Erro 401: ${err}`); //TODO - remove this line
            // You might trigger a re-authentication flow or redirect the user here
          } else {
            // Handle other HTTP error codes
            // this.toastrservice.error(`HTTP erro: ${err.message}`);
            console.log(`Erro http: ${err}`); //TODO - remove this line
          }
        } else {
          // Handle non-HTTP errors
          // this.toastrservice.error(`Erro: ${err.message}`);
          console.log(`Erro non-http: ${err}`); //TODO - remove this line
        }

        // Re-throw the error to propagate it further
        return throwError(() => err);
      })
    );
  }
}
