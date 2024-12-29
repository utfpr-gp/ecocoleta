import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {AuthenticateService} from "../auth/authenticate.service";
import {Router} from "@angular/router";

export type User = {
    id: string;
    name?: string;
    email: string;
    password?: string;
    phone?: number;
    cpf?: number;
    cnpj?: number;
    picture?: string | File;
    role?: string;
    token?: string;
    createdAt?: string;
    updatedAt?: string;
};

export enum UserRole {
    WASTE_COLLECTOR = 'WASTE_COLLECTOR',
    RESIDENT = 'RESIDENT',
    COMPANY = 'COMPANY',
    ADMIN = 'ADMIN',
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrlUser: string = `${environment.API}/user`;
  public userSubject = new BehaviorSubject<User | null>(null);

  constructor(
      private http: HttpClient,
      private router: Router,
      private authService: AuthenticateService
  ) {
      this.loadUserFromToken();
  }

    private loadUserFromToken() {
        const jwtPayload = this.authService.getJwtPayload();
        if (jwtPayload) {
            const user: User = {
                id: jwtPayload.id,
                name: jwtPayload.name,
                email: jwtPayload.email,
                role: jwtPayload.role,
            };
            this.userSubject.next(user);
        }
    }

    getUserLogged(): Observable<User | null> {
        return this.userSubject.asObservable();
    }

    getUserRole(){
        return this.userSubject.value?.role || null;
    }
    // getUserRole() {
    //     switch (this.userSubject.value?.role) {
    //         case 'WASTE_COLLECTOR':
    //             return UserRole.WASTE_COLLECTOR;
    //         case 'RESIDENT':
    //             return UserRole.RESIDENT;
    //         case 'COMPANY':
    //             return UserRole.COMPANY;
    //         case 'ADMIN':
    //             return UserRole.ADMIN;
    //         default:
    //             return UserRole.RESIDENT;
    //     }
    // }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrlUser}/${userId}`);
    }

    //MÉTODOS DE CRUD
    createUserWasteCollector(user: User): Observable<User> {
        //Add role to user
        user.role = UserRole.WASTE_COLLECTOR;

        console.log('user servic log> createUserWasteCollector', user); //TODO apagar apos teste

        return this.http
            .post<User>(`${this.apiUrlUser}/waste-collector`, user)
            .pipe(
                tap((value) => {
                    if (value.token) {
                        //setando token no sessionStorage
                        this.authService.armazenarToken(value.token);
                        // TODO verificar  a role do user para redirecionar correto ?
                        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
                        localStorage.removeItem('redirectUrl');
                        this.router.navigate([redirectUrl]);
                    }
                })
            );
    }

    createUserResident(user: User): Observable<User> {
        //Add role to user
        user.role = UserRole.RESIDENT;

        console.log('user servic log> createUserResident', user); //TODO apagar apos teste

        return this.http.post<User>(`${this.apiUrlUser}/resident`, user).pipe(
            tap((value) => {
                // const token = value.token;
                if (value.token) {
                    //setando token no sessionStorage
                    this.authService.armazenarToken(value.token);
                    // TODO verificar  a role do user para redirecionar correto ?
                    const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
                    localStorage.removeItem('redirectUrl');
                    this.router.navigate([redirectUrl]);
                }
            })
        );
    }

    // UPDATE METHODS
    updateUser(user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrlUser}`, user);
    }
}
