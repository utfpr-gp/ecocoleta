import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {MessageService} from "primeng/api";
import {FileUploadModule} from "primeng/fileupload";
import {ImageModule} from "primeng/image";
import {AvatarModule} from "primeng/avatar";

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
        FileUploadModule,
        ImageModule,
        AvatarModule,
    ],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
    formUser!: FormGroup;
    @Input() formData: User | null = null;
    @Input() formModeUpdate: boolean = false; //se editar ou cadastrar
    @Input() userRole: string = null;
    @Output() formSubmitted = new EventEmitter<{ user: User, action: 'create' | 'update' }>();

    previewImg: string | ArrayBuffer | null = null; // Para armazenar a URL da imagem
    imgBytes: Uint8Array | null = null; // Para armazenar os bytes da imagem

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        console.log('oninit form-user'); //TODO apagar apos teste

        // Caso seja modo de edição, carregar os dados do usuário no formulário
        if (this.formData) {

            console.log('iniciando formData user-form: ', this.formData); //TODO apagar apos teste

            this.userRole = this.formData.role;
            this.formUser.patchValue(this.formData);
        }

        // Inicializar formulário
        this.initForm();
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

    onSelectImg(event: any) {
        const file: File = event.files[0];

        if (file) {
            // Validação do tamanho
            if (file.size > 5000000) { // 1MB
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'A imagem deve ter no máximo 5MB.',
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                this.previewImg = reader.result; // Para a miniatura
                this.imgBytes = new Uint8Array(reader.result as ArrayBuffer); // Para os bytes

                // Armazena o arquivo no formulário, mas ainda não faz o upload
                this.formUser.patchValue({
                    picture: file, // Aqui estamos passando o arquivo diretamente, não a URL
                });
            };

            reader.onerror = () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao carregar a imagem. Tente novamente.',
                });
            };

            reader.readAsDataURL(file); // Converte o arquivo para uma URL base64
        }
    }

    onSubmit() {
        if (this.formUser.valid) {
            const user = this.formUser.value as User;

            if (this.formModeUpdate) {
                this.formSubmitted.emit({user, action: 'update'});
            } else {
                this.formSubmitted.emit({user, action: 'create'});
            }
        }
    }

    onCancel(): void {
        // Lógica para voltar ou cancelar ação
        console.log('Cancel action');
        this.router.navigate(['/landing']);
    }
}
