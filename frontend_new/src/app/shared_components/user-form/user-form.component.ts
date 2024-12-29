import {Component, Input, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormValidations} from '../../core/utils/form-validation';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MessageComponent} from "../message.component";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {User, UserRole, UserService} from "../../domains/user/user.service";
import {RippleModule} from "primeng/ripple";

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        MessageComponent,
        PanelModule,
        PasswordModule,
        RippleModule,
    ],
    // providers: [LoginService],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
    formUser!: FormGroup;
    @Input() formModeUpdate: boolean = false; //se editar ou cadastrar
    @Input() userRole: string = null;
    // Variável para armazenar a URL local da imagem para exibição
    imagePreview: string | ArrayBuffer | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        // TODO  implementar como pegar id do user na rota para edição do user e abrir o form preenchido
        // Verificar se estamos em modo de edição
        // const userId = parseInt(this.route.snapshot.paramMap.get('id'));
        // this.formModeUpdate = !!userId;

        // Inicializar formulário
        this.initForm();

        // Caso seja modo de edição, carregar os dados do usuário
        // if (this.formModeUpdate && userId) {
        //     this.userService.getUserById(userId).subscribe((user) => {
        //         this.userRole = user.role;
        //         this.formUser.patchValue(user); // Preenche os campos com os dados do usuário
        //         // this.updateValidations();
        //     });
        // }
    }

    initForm() {
        this.formUser = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email]),
            emailCheck: new FormControl(
                '',
                !this.formModeUpdate
                    ? [
                        Validators.required,
                        Validators.email,
                        FormValidations.equalTo('email'),
                    ]
                    : []
            ),
            password: new FormControl(
                '',
                !this.formModeUpdate
                    ? [Validators.required, Validators.minLength(5)]
                    : []
            ),
            passwordCheck: new FormControl(
                '',
                !this.formModeUpdate
                    ? [
                        Validators.required,
                        Validators.minLength(5),
                        FormValidations.equalTo('password'),
                    ]
                    : []
            ),
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(250),
            ]),
            phone: new FormControl('', [
                Validators.required,
                Validators.minLength(11),
            ]),
            cpf: new FormControl(
                '',
                this.userRole === 'WASTE_COLLECTOR'
                    ? [Validators.required, Validators.minLength(11)]
                    : []
            ),
            cnpj: new FormControl(
                '',
                this.userRole === 'COMPANY'
                    ? [Validators.required, Validators.minLength(11)]
                    : []
            ),
            picture: new FormControl(
                '',
                this.userRole === 'WASTE_COLLECTOR' ? [Validators.required] : []
            ),
        });
    }

    // updateValidations() {
    //     if (this.userRole === 'WASTE_COLLECTOR') {
    //         this.formUser.get('cpf')?.setValidators([Validators.required, Validators.minLength(11)]);
    //         this.formUser.get('picture')?.setValidators([Validators.required]);
    //     } else {
    //         this.formUser.get('cpf')?.clearValidators();
    //         this.formUser.get('picture')?.clearValidators();
    //     }
    //
    //     this.formUser.get('cpf')?.updateValueAndValidity();
    //     this.formUser.get('picture')?.updateValueAndValidity();
    // }

    onSubmit() {
        if (this.formUser.valid) {
            const user = this.formUser.value as User;

            if (this.formModeUpdate) {
                // Atualizar usuário
                // TODO validar se rota esta ok e generica
                this.userService.updateUser(user).subscribe({
                    next: () => {
                        alert('Usuário atualizado com sucesso!');
                        this.router.navigate(['/users']);
                    },
                    error: (err) => alert(`Erro ao atualizar usuário: ${err.message}`),
                });
            } else {
                // Criar novo usuário
                // TODO validar se rota esta ok e generica
                // this.userService.createUser(user).subscribe({
                //     next: () => {
                //         alert('Usuário cadastrado com sucesso!');
                //         this.router.navigate(['/users']);
                //     },
                //     error: (err) => alert(`Erro ao cadastrar usuário: ${err.message}`),
                // });
            }
        }
    }

    onCancel(): void {
        // Lógica para voltar ou cancelar ação
        console.log('Cancel action');
        this.router.navigate(['/landing']);
    }

    onFileChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
}
