import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, switchMap, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticateService} from "../auth/authenticate.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {CloudinaryUploadImgService} from "../../core/services/cloudinary-upload-img.service";

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
        private cloudinaryUploadImgService: CloudinaryUploadImgService,
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

        // TODO fazer if se role waste faz upload pega urlcloudnary e salva no user.picture novamente e persiste no banco interno

        if (role === 'WASTE_COLLECTOR' && user.picture) {
            const file: File = user.picture as File;
            // this.cloudinaryUploadImgService.uploadImage(file)
            //     .then((imageUrl) => {
            //         console.log('Image uploaded:', imageUrl);
            //         user.picture = String(imageUrl);
            //         // Use the imageUrl for further processing (e.g., display or store)
            //     })
            //     .catch((error) => {
            //         console.error('Error uploading image:', error);
            //         // Handle upload errors
            //     });

            // const file: File = user.picture as File;
            // this.cloudinaryUploadImgService.uploadImage(file)
            //     .then(
            //         (urlimg) => {
            //             console.log('urlimg', urlimg); //TODO remover apos teste
            //             user.picture = String(urlimg);
            //             // }                user.picture = String(urlimg);
            //         }
            //     )
            //     .catch((error) => {
            //         console.error('Erro ao fazer upload da imagem:', error); //TODO remover apos teste
            //         this.messageService.add({
            //             severity: 'error',
            //             summary: 'Erro',
            //             detail: 'Falha ao fazer upload da imagem erro: ' + error,
            //         });
            //     });

        }

        const endpoint = this.getUserCreationUrl(role);

        return this.http.post<User>(endpoint, user).pipe(
            tap((value) => {
                if (value.token) {
                    this.handleLoginRedirection(value.token);
                }
            })
        );
    }


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
