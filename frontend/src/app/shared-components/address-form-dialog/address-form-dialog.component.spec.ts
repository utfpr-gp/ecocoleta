import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressFormDialogComponent } from './address-form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViacepApiService } from '../../core/services/viacep-api.service';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

describe('AddressFormDialogComponent', () => {
    let component: AddressFormDialogComponent;
    let fixture: ComponentFixture<AddressFormDialogComponent>;
    let viacepApiService: jasmine.SpyObj<ViacepApiService>;
    let messageService: jasmine.SpyObj<MessageService>;

    beforeEach(async () => {
        const viacepApiServiceMock = jasmine.createSpyObj('ViacepApiService', ['buscarCep']);
        const messageServiceMock = jasmine.createSpyObj('MessageService', ['add']);

        await TestBed.configureTestingModule({
            imports: [AddressFormDialogComponent, ReactiveFormsModule, HttpClientTestingModule],
            providers: [
                { provide: ViacepApiService, useValue: viacepApiServiceMock },
                { provide: MessageService, useValue: messageServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddressFormDialogComponent);
        component = fixture.componentInstance;
        viacepApiService = TestBed.inject(ViacepApiService) as jasmine.SpyObj<ViacepApiService>;
        messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
        component.ngOnInit();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve inicializar o formulário corretamente', () => {
        expect(component.addressForm).toBeTruthy();
        expect(component.addressForm.controls['cep']).toBeDefined();
        expect(component.addressForm.controls['name']).toBeDefined();
    });

    it('deve preencher os campos ao buscar um CEP válido', () => {
        const mockResponse = {
            logradouro: 'Rua Emiliano Perneta',
            bairro: 'Alto da XV',
            localidade: 'Guarapuava',
            estado: 'Paraná'
        };

        viacepApiService.buscarCep.and.returnValue(of(mockResponse));
        component.onCepChange('85065070');

        expect(viacepApiService.buscarCep).toHaveBeenCalledWith('85065070');
        expect(component.addressForm.get('street')?.value).toBe('Rua Emiliano Perneta');
        expect(component.addressForm.get('neighborhood')?.value).toBe('Alto da XV');
        expect(component.addressForm.get('city')?.value).toBe('Guarapuava');
        expect(component.addressForm.get('state')?.value).toBe('Paraná');
    });

    it('deve validar o formulário corretamente', () => {
        component.addressForm.setValue({
            cep: '85065070',
            name: 'Casa',
            street: 'Rua Emiliano Perneta',
            number: '303',
            neighborhood: 'Alto da XV',
            city: 'Guarapuava',
            state: 'Paraná'
        });

        expect(component.addressForm.valid).toBeTrue();
    });

    it('deve exibir mensagem de erro quando o formulário estiver inválido', () => {
        component.addressForm.setValue({
            cep: '',
            name: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: ''
        });

        component.salveAddress();

        expect(messageService.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: 'Erro',
            detail: 'Por favor, preencha os campos obrigatórios',
            life: 3000
        });
    });
});
