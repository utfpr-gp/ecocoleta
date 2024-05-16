import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../types/user.type';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import jwt_decode from 'jwt-decode';
import { UserRole } from '../types/user-role.type';
// import { Token } from '../types/token.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = `${environment.API}`;
  apiUrlUser: string = `${environment.API}/user`;

  public userRole: UserRole = UserRole.RESIDENT;
  private userSubject = new BehaviorSubject<User | null>(null);
  // private userTokenSubject = new BehaviorSubject<Token | null>(null);

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {
    if (this.loginService.existsToken()) {
      this.decodeJWT();
      this.userRole = this.returnUserRole();
    }
  }

  //METHODS UTILS
  decodeJWT() {
    let token = this.loginService.getToken();
    let userTokenDecode = jwt_decode(token) as User;
    this.userSubject.next(userTokenDecode);

    console.log('user token service log> decodeJWT', userTokenDecode); //TODO apagar apos teste
  }

  returnUserRole() {
    switch (this.userSubject.value?.role) {
      case 'WASTE_COLLECTOR':
        return UserRole.WASTE_COLLECTOR;
      case 'RESIDENT':
        return UserRole.RESIDENT;
      case 'COMPANY':
        return UserRole.COMPANY;
      case 'ADMIN':
        return UserRole.ADMIN;
      default:
        return UserRole.RESIDENT;
    }
  }

  returnUser() {
    // return this.userTokenSubject.asObservable();
    return this.userSubject.asObservable();
  }

  setUserToken(value: string) {
    this.loginService.setToken(value);
    this.decodeJWT();
  }

  logout() {
    this.loginService.removeToken();
    // this.userTokenSubject.next(null);
    this.userSubject.next(null);
  }

  isLogged() {
    return this.loginService.existsToken();
  }

  //GET METHODS

  // getUser(): Observable<User> {
  //   // return this.httpClient.get<User>(`${this.apiUrl}/user`);
  //   return this.httpClient.get<User>(`${this.apiUrl}/hello`); // TODO Alterado para testar a API
  // }
  getUser(): Observable<User> {
    // return this.httpClient.get<User>(`${this.apiUrl}/user`);
    return this.httpClient.get<any>(`${this.apiUrl}/hello`); // TODO Alterado para testar a API
  }

  // buscarCadastro(): Observable<PessoaUsuaria> {
  //   return this.http.get<PessoaUsuaria>(`${this.apiUrl}/auth/perfil`);
  // }

  // editarCadastro(pessoaUsuaria: PessoaUsuaria): Observable<PessoaUsuaria> {
  //   return this.http.patch<PessoaUsuaria>(`${this.apiUrl}/auth/perfil`, pessoaUsuaria);
  // }

  //CREATE METHODS
  createUserWasteCollector(user: User): Observable<User> {
    //Add role to user
    user.role = UserRole.WASTE_COLLECTOR;

    //TODO refactor this, esta mandando o bjeto inteiro com emailchack etc, api nã oesta aceitando...
    console.log('user servic log> createUserWasteCollector', user); //TODO apagar apos teste

    return this.httpClient
      .post<User>(`${this.apiUrlUser}/waste-collector`, user)
      .pipe(
        tap((value) => {
          if (value.token) {
            //setando token no sessionStorage
            this.loginService.setToken(value.token);
          }
        })
      );
  }

  createUserResident(user: User): Observable<User> {
    //Add role to user
    user.role = UserRole.RESIDENT;

    console.log('user servic log> createUserResident', user); //TODO apagar apos teste

    return this.httpClient.post<User>(`${this.apiUrlUser}/resident`, user).pipe(
      tap((value) => {
        // const token = value.token;
        if (value.token) {
          //setando token no sessionStorage
          this.loginService.setToken(value.token);
        }
      })
    );
  }
}
