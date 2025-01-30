import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'statusTranslate'
})
export class StatusTranslatePipe implements PipeTransform {
    transform(value: string): string {
        const translations: { [key: string]: string } = {
            PENDING: 'Pendente',
            PAUSED: 'Pausado',
            IN_PROGRESS: 'Em andamento',
            COMPLETED: 'Concluído',
            CANCELLED: 'Cancelado'
        };

        return translations[value] || value; // Retorna a tradução ou o valor original se não encontrado
    }
}
