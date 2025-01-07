import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserService} from "../user.service";

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
    userId: string | null = null;
    user: User | null = null;


    constructor(private router: Router,
                private paramsRoute: ActivatedRoute,
                private userService: UserService,) {
    }

    ngOnInit(): void {
        this.userId = this.paramsRoute.snapshot.paramMap.get('user_id');

        if (this.userId) {

            console.log('userId', this.userId); //TODO apagar apos teste

            // Chama o serviço para pegar os dados do usuário
            this.userService.getUserById(this.userId).subscribe((user) => {
                this.user = user;
                // Se necessário, adicione a lógica para preencher o formulário ou outros dados
                // this.loadForm();
            });
        }
    }

}
