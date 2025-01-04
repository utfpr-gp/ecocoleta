import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
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
    async createUser(user: User, role: UserRole): Promise<void> {
        try {
            // Atualiza o role do usuário
            user.role = role;

            if (role === 'WASTE_COLLECTOR' && user.picture) {
                const file: File = user.picture as File;

                // Aguarda o upload da imagem e atualiza o user.picture
                const imageUrl = await this.cloudinaryUploadImgService.uploadImage(file);
                user.picture = imageUrl;
            }

            const endpoint = this.getUserCreationUrl(role);

            // Envia o usuário atualizado para o servidor
            const savedUser = await this.http.post<User>(endpoint, user).toPromise();

            // Verifica o token e faz a redireção, se necessário
            if (savedUser.token) {
                this.handleLoginRedirection(savedUser.token);
            }
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro ao criar usuário',
                detail: this.getErrorMessage(error),
                life: 3000,
            });
        }
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
