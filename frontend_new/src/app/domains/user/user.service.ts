import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticateTokenService} from "../auth/authenticate-token.service";
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
    role?: UserRole | string;
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
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable(); // Observable para componentes assinarem

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthenticateTokenService,
        private cloudinaryUploadImgService: CloudinaryUploadImgService,
        private messageService: MessageService
    ) {
        this.loadUserFromToken();
    }

    public loadUserFromToken() {
        const jwtPayload = this.authService.getJwtPayload();
        if (jwtPayload) {
            const user: User = {
                id: jwtPayload.id,
                name: jwtPayload.name,
                email: jwtPayload.email,
                role: jwtPayload.role,
            };
            this.userSubject.next(user);
        } else {
            this.userSubject.next(null); // Caso o token não seja válido ou não exista
        }
    }

    // Métood de logout aqui para zerar o userSubject
    logout(): void {
        this.authService.logout();
        this.userSubject.next(null); // Notifica que não há usuário logado
    }

    private handleLoginRedirection(token: string): void {
        this.authService.armazenarToken(token);
        const redirectUrl = localStorage.getItem('redirectUrl') || '/home';
        localStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
    }

    private getUserCreationUrl(role: UserRole | string): string {
        switch (role) {
            case UserRole.WASTE_COLLECTOR:
                return `${this.apiUrlUser}/waste-collector`;
            case UserRole.RESIDENT:
                return `${this.apiUrlUser}/resident`;
            default:
                throw new Error('Role não suportada');
        }
    }

    // Retorna o estado atual do usuário
    getCurrentUser(): User | null {
        return this.userSubject.value;
    }

    // Atualiza manualmente o estado do usuário
    updateUserSubject(user: User): void {
        this.userSubject.next(user);
    }

    // Limpa o estado do usuário (logout, por exemplo)
    clearUser(): void {
        this.userSubject.next(null);
    }

    getUserLogged(): Observable<User | null> {
        return this.userSubject.asObservable();
    }

    getUserRole() {
        return this.userSubject.value?.role || null;
    }

    getUserById(userId: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrlUser}/${userId}`)
            .pipe( // TODO apagar apos teste
                tap((user) => console.log('User fetched:', user))
            );
    }

    //MÉTODOS DE CRUD
    async createAndUpdateUser(user: User): Promise<void> {
        try {
            if (user.id) {
                // Atualizando o usuário existente
                console.log('Atualizando usuário ::', user.id); // TODO: Remover após teste

                const updatedUser = await this.http
                    .put<User>(`${this.apiUrlUser}/${user.id}`, user)
                    .toPromise();

                console.log('Usuário atualizado com sucesso:', updatedUser); // TODO: Remover após teste
            } else {
                // Criando um novo usuário
                console.log('Criando novo usuário ::', user); // TODO: Remover após teste

                if (user.role === 'WASTE_COLLECTOR' && user.picture) {
                    const file: File = user.picture as File;

                    // Faz o upload da imagem e atualiza o campo `picture` do usuário
                    const imageUrl = await this.cloudinaryUploadImgService.uploadImage(file);
                    user.picture = imageUrl;
                }

                const endpoint = this.getUserCreationUrl(user.role);

                const newUser = await this.http.post<User>(endpoint, user).toPromise();

                console.log('Novo usuário criado com sucesso:', newUser); // TODO: Remover após teste

                if (newUser.token) {
                    this.handleLoginRedirection(newUser.token);
                }
            }
        } catch (error) {
            console.error('Erro ao criar/atualizar usuário:', error); // TODO: Remover após teste

            // Exibe mensagem de erro detalhada
            this.messageService.add({
                severity: 'error',
                summary: 'Erro ao criar/atualizar usuário',
                detail: this.getErrorMessage(error?.error),
                life: 3000,
            });

            // Lança o erro para ser tratado no componente
            throw error;
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
