import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormValidations} from '../../core/utils/form-validation';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MessageComponent} from "../message.component";
import {PanelModule} from "primeng/panel";
import {PasswordModule} from "primeng/password";
import {User} from "../../domains/user/user.service";
import {RippleModule} from "primeng/ripple";
import {MessageService} from "primeng/api";
import {FileUploadModule} from "primeng/fileupload";
import {ImageModule} from "primeng/image";
import {AvatarModule} from "primeng/avatar";
import {NgxMaskModule} from "ngx-mask";

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
        NgxMaskModule,
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
        private router: Router,
        private messageService: MessageService
    ) {
    }

    ngOnInit() {
        // Inicializar formulário
        this.initForm();

    }

    initForm() {
        this.formUser = this.formBuilder.group({
            id: new FormControl(''),  // Adiciona o campo id
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
                Validators.required
            ]),
            cpf: new FormControl(
                '',
                this.userRole === 'WASTE_COLLECTOR'
                    ? [Validators.required]
                    : []
            ),
            cnpj: new FormControl(
                '',
                this.userRole === 'COMPANY'
                    ? [Validators.required]
                    : []
            ),
            companyName: new FormControl(
                '',
                this.userRole === 'COMPANY' ? [Validators.required, Validators.minLength(3), Validators.maxLength(250)] : []
            ),
            picture: new FormControl(
                '',
                this.userRole === 'WASTE_COLLECTOR' ? [Validators.required] : []
            ),
        });

        // Caso seja modo de edição, carregar os dados do usuário no formulário
        if (this.formData) {
            const user = { ...this.formData };
            this.userRole = user.role;
            user.phone = this.applyMask(user.phone, '(00) 00000-0000');
            user.cpf = this.applyMask(user.cpf, '000.000.000-00');
            user.cnpj = this.applyMask(user.cnpj, '00.000.000/0000-00');
            this.formUser.patchValue(user);
            // this.formUser.patchValue(this.formData);
        }
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
            let user = { ...this.formUser.value };
            // const user = this.formUser.value as User;

            // Remove máscaras antes de enviar
            user.phone = user.phone.replace(/\D/g, '');
            if (user.cpf) user.cpf = user.cpf.replace(/\D/g, '');
            if (user.cnpj) user.cnpj = user.cnpj.replace(/\D/g, '');

            // Garante que o id está incluso mesmo que não seja exibido no formulário
            if (this.formModeUpdate && this.formData?.id) {
                user.id = this.formData.id;
            }

            if (this.formModeUpdate) {
                this.formSubmitted.emit({user, action: 'update'});
            } else {
                this.formSubmitted.emit({user, action: 'create'});
            }
        }
    }

    onCancel(): void {
        // Lógica para voltar ou cancelar ação
        this.router.navigate(['/landing']);
    }

    applyMask(value: string, mask: string): string {
        if (!value) return '';
        const masked = value.replace(/\D/g, '').split('');
        return mask.replace(/0/g, () => masked.shift() || '');
    }
}
