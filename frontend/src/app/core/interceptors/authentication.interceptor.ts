// import { HttpInterceptorFn } from '@angular/common/http';

// export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable()
export class authenticationInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.loginService.existsToken()) {
      const token = this.loginService.getToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }

  //TODO verificar interceptação não esta enviando o header authorization
}
