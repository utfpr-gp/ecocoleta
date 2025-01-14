import {Component, OnInit} from '@angular/core';
import {CollectFormComponent} from "../../../shared-components/collect-form/collect-form.component";
import {UserFormComponent} from "../../../shared-components/user-form/user-form.component";
import {User, UserService} from "../../user/user.service";
import {Collect, CollectService} from "../collect.service";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-new-collect',
    standalone: true,
    imports: [
        CollectFormComponent,
        UserFormComponent
    ],
    templateUrl: './new-collect.component.html',
    styleUrl: './new-collect.component.scss'
})
export class NewCollectComponent implements OnInit {
    user: User | null = null;

    constructor(private userService: UserService,
                private collectService: CollectService,
                private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.userService.user$.subscribe(user => {
            this.user = user;
        });
    }


    handleFormSubmission(event: { collect: Collect, action: 'create' | 'update' }) {
        const {collect, action} = event;

        if (action === 'create') {
            console.log('componente page nova coleta Criar COleta', collect); //TODO apagar apos teste
            // Adiciona o ID do usuário ao corpo da requisição
            collect.id_resident = Number(this.user.id);

            this.createCollect(collect);
        }
    }

    /**
     * Método responsável por criar uma nova coleta.
     * @param collect Dados da coleta a ser criada.
     */
    private createCollect(collect: Collect): void {
        console.log('Criando nova coleta:', collect);

        this.collectService.createCollect(collect).subscribe({
            next: (response) => {
                console.log('Coleta criada com sucesso:', response); //todo apagar apos teste

                // Exibe mensagem de sucesso
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Coleta criada com sucesso!',
                    life: 3000
                });

                // Aqui você pode redirecionar ou atualizar a lista de coletas
            },
            error: (error) => {
                console.error('Erro ao criar coleta:', error); //todo apagar apos teste

                // Exibe mensagem de erro
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao criar coleta,' + error?.message,
                    life: 3000
                });
            }
        });
    }
}
