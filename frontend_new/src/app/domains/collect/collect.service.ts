import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticateTokenService} from "../auth/authenticate-token.service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {CloudinaryUploadImgService} from "../../core/services/cloudinary-upload-img.service";

export type Collect = {
    id: string;
    name?: string;
    email: string;
    password?: string;
    phone?: number;
    cpf?: number;
    cnpj?: number;
    picture?: string | File;
    token?: string;
    createdAt?: string;
    updatedAt?: string;
};

export enum MateriaisReciclaveis {
    VIDRO = 'Vidro',
    PLASTICO = 'Plástico',
    PAPEL = 'Papel',
    METAL = 'Metal',
    ELETRONICO = 'Eletrônico',
    OUTROS = 'Outros'
}


@Injectable({
    providedIn: 'root',
})
export class UserService {
    // apiUrlUser: string = `${environment.API}/user`;
    // private userSubject = new BehaviorSubject<User | null>(null);
    // user$ = this.userSubject.asObservable(); // Observable para componentes assinarem

    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthenticateTokenService,
        private cloudinaryUploadImgService: CloudinaryUploadImgService,
        private messageService: MessageService
    ) {
    }


}
