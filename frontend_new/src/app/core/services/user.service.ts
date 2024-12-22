// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { User } from '../types/user.type';
// import { environment } from '../../../environments/environment';
// import { LoginService } from './login.service';
// import { UserRole } from '../types/user-role.type';
// import { JwtHelperService } from '@auth0/angular-jwt';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   apiUrlUser: string = `${environment.API}/user`;
//
//   public userRole: UserRole = UserRole.RESIDENT;
//   private userSubject = new BehaviorSubject<User | null>(null);
//
//   constructor(
//     private httpClient: HttpClient,
//     private loginService: LoginService,
//     private jwtHelper: JwtHelperService
//   ) {
//     if (this.loginService.existsToken()) {
//       this.decodeJWT();
//       this.userRole = this.returnUserRole();
//     }
//   }
//
//   //METHODS UTILS
//   decodeJWT() {
//     let token = this.loginService.getToken();
//     let userTokenDecode = this.jwtHelper.decodeToken(token) as User;
//     this.userSubject.next(userTokenDecode);
//
//     console.log('user token service log> decodeJWT', userTokenDecode); //TODO apagar apos teste
//   }
//
//   returnUserRole() {
//     switch (this.userSubject.value?.role) {
//       case 'WASTE_COLLECTOR':
//         return UserRole.WASTE_COLLECTOR;
//       case 'RESIDENT':
//         return UserRole.RESIDENT;
//       case 'COMPANY':
//         return UserRole.COMPANY;
//       case 'ADMIN':
//         return UserRole.ADMIN;
//       default:
//         return UserRole.RESIDENT;
//     }
//   }
//
//   getUserLoggedId() {
//     return parseInt(this.userSubject.value?.id as string);
//   }
//
//   returnUser(): Observable<User | null> {
//     return this.userSubject.asObservable();
//   }
//
//   setUserToken(value: string) {
//     this.loginService.setToken(value);
//     this.decodeJWT();
//   }
//
//   logout() {
//     this.loginService.removeToken();
//     // this.userTokenSubject.next(null);
//     this.userSubject.next(null);
//   }
//
//   isLogged() {
//     return this.loginService.existsToken();
//   }
//
//   //GET METHODS
//   getUser(id: any): Observable<User> {
//     // const headers = new HttpHeaders({'Authorization': `Bearer ${this.loginService.getToken()}`}); // desnecessario com o interceptor
//     return this.httpClient.get<User>(`${this.apiUrlUser}/${id}`);
//   }
//
//   //CREATE METHODS
//   createUserWasteCollector(user: User): Observable<User> {
//     //Add role to user
//     user.role = UserRole.WASTE_COLLECTOR;
//
//     //TODO refactor this, esta mandando o bjeto inteiro com emailchack etc, api nã oesta aceitando...
//     console.log('user servic log> createUserWasteCollector', user); //TODO apagar apos teste
//
//     return this.httpClient
//       .post<User>(`${this.apiUrlUser}/waste-collector`, user)
//       .pipe(
//         tap((value) => {
//           if (value.token) {
//             //setando token no sessionStorage
//             this.loginService.setToken(value.token);
//           }
//         })
//       );
//   }
//
//   createUserResident(user: User): Observable<User> {
//     //Add role to user
//     user.role = UserRole.RESIDENT;
//
//     console.log('user servic log> createUserResident', user); //TODO apagar apos teste
//
//     return this.httpClient.post<User>(`${this.apiUrlUser}/resident`, user).pipe(
//       tap((value) => {
//         // const token = value.token;
//         if (value.token) {
//           //setando token no sessionStorage
//           this.loginService.setToken(value.token);
//         }
//       })
//     );
//   }
//
//   // UPDATE METHODS
//   updateUser(user: User): Observable<User> {
//     return this.httpClient.put<User>(`${this.apiUrlUser}`, user);
//   }
// }
