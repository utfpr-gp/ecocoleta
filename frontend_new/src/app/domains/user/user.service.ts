import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, switchMap, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticateService} from "../auth/authenticate.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

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
        private authService: AuthenticateService,
        private messageService: MessageService
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

    private handleLoginRedirection(token: string): void {
        this.authService.armazenarToken(token);
        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
        localStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
    }

    private getUserCreationUrl(role: UserRole): string {
        switch (role) {
            case UserRole.WASTE_COLLECTOR:
                return `${this.apiUrlUser}/waste-collector`;
            case UserRole.RESIDENT:
                return `${this.apiUrlUser}/resident`;
            default:
                throw new Error('Role não suportada');
        }
    }

    getUserLogged(): Observable<User | null> {
        return this.userSubject.asObservable();
    }

    getUserRole() {
        return this.userSubject.value?.role || null;
    }

    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrlUser}/${userId}`);
    }

    //MÉTODOS DE CRUD
    createUser(user: User, role: UserRole): Observable<User> {

        console.log('user service log> createUser', user, role); //TODO apagar apos teste

        user.role = role;

        const endpoint = this.getUserCreationUrl(role);

        return this.http.post<User>(endpoint, user).pipe(
            tap((value) => {
                if (value.token) {
                    this.handleLoginRedirection(value.token);
                }
            })
        );
    }

    // TODO finalizar método com upload da img
    // createUser(user: User, role: UserRole): Observable<User> {
    //     console.log('user service log> createUser', user, role);
    //
    //     user.role = role;
    //
    //     // Verifica se o usuário é um Waste Collector
    //     if (role === 'WASTE_COLLECTOR' && user.picture) {
    //         return this.uploadToCloudinary(user.picture).pipe(
    //             switchMap((url) => {
    //                 user.picture = url; // Atualiza a URL da imagem no usuário
    //                 const endpoint = this.getUserCreationUrl(role);
    //                 return this.http.post<User>(endpoint, user);
    //             }),
    //             tap((value) => {
    //                 if (value.token) {
    //                     this.handleLoginRedirection(value.token);
    //                 }
    //             }),
    //             catchError((error) => {
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Erro ao criar usuário',
    //                     detail: this.getErrorMessage(error),
    //                     life: 5000,
    //                 });
    //                 throw error;
    //             })
    //         );
    //     } else {
    //         const endpoint = this.getUserCreationUrl(role);
    //         return this.http.post<User>(endpoint, user).pipe(
    //             tap((value) => {
    //                 if (value.token) {
    //                     this.handleLoginRedirection(value.token);
    //                 }
    //             }),
    //             catchError((error) => {
    //                 this.messageService.add({
    //                     severity: 'error',
    //                     summary: 'Erro ao criar usuário',
    //                     detail: this.getErrorMessage(error),
    //                     life: 5000,
    //                 });
    //                 throw error;
    //             })
    //         );
    //     }
    // }

    // TODO melhorar co mnova api de upload
    // private uploadToCloudinary(picture: Uint8Array): Observable<string> {
    //     const formData = new FormData();
    //     formData.append('file', new Blob([picture]), 'user-image');
    //     formData.append('upload_preset', '<your_upload_preset>'); // Configure no Cloudinary
    //
    //     const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload`;
    //
    //     return this.http.post<any>(cloudinaryEndpoint, formData).pipe(
    //         tap((response) => console.log('Upload Cloudinary:', response)),
    //         switchMap((response) => of(response.secure_url)), // Retorna a URL segura
    //         catchError((error) => {
    //             console.error('Erro ao fazer upload para o Cloudinary:', error);
    //             throw error;
    //         })
    //     );
    // }

    private getErrorMessage(error: any): string {
        if (!navigator.onLine) {
            return 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
        }

        if (error.status === 400) {
            return 'Os dados fornecidos são inválidos. Por favor, revise o formulário.';
        }

        if (error.status === 413) {
            return 'A imagem é muito grande. Certifique-se de que o arquivo tenha no máximo 1MB.';
        }

        if (error.status === 500) {
            return 'Erro no servidor. Tente novamente mais tarde.';
        }

        if (error.message) {
            return error.message; // Exibe uma mensagem genérica
        }

        return 'Ocorreu um erro inesperado. Por favor, tente novamente.';
    }

}
