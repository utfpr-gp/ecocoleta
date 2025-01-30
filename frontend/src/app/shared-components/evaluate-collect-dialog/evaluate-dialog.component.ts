import {Component, EventEmitter, Input, Output} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import {CollectService} from "../../domains/collect/collect.service";
import { FormsModule } from '@angular/forms'; // Importação necessária


@Component({
    selector: 'app-evaluate-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, RippleModule, RatingModule, FormsModule],
    templateUrl: './evaluate-dialog.component.html',
    styleUrls: ['./evaluate-dialog.component.scss']
})
export class EvaluateDialogComponent {
    @Input() evaluationDialogVisible: boolean = false;
    @Input() collectId: string | null = null; // ID da coleta a ser avaliada
    @Output() outEvaluationDialog = new EventEmitter<boolean>();


    selectedRating: number = 0;

    constructor(
        private collectService: CollectService,
        private messageService: MessageService
    ) {}

    hideDialog(): void {
        this.evaluationDialogVisible = false;
        this.outEvaluationDialog.emit(false);
        this.selectedRating = 0;
    }

    submitEvaluation(): void {
        if (this.collectId && this.selectedRating) {
            this.collectService.evaluateCollect(this.collectId, this.selectedRating).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Avaliação Enviada',
                        detail: 'A coleta foi avaliada com sucesso!',
                        life: 3000
                    });
                    this.hideDialog();
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: err?.error?.message || 'Não foi possível enviar a avaliação.',
                        life: 3000
                    });
                }
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Selecione uma pontuação antes de enviar.',
                life: 3000
            });
        }
    }
}
