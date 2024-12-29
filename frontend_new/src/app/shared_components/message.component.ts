import {Component, Input} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';

@Component({
    selector: 'app-message',
    template: `
        <div *ngIf="temErro()"
             class="ng-invalid ng-dirty">
            {{ text }}
        </div>
    `,
    standalone: true,
    styles: [`
        .ng-dirty {
            margin: 2px;
            margin-top: 4px;
            padding: 3px;
        }
    `]
})
export class MessageComponent {
    @Input() error: string = '';
    @Input() control?: AbstractControl | FormControl | null;
    @Input() text: string = '';

    temErro(): boolean {
        return this.control ? this.control.hasError(this.error) && this.control.dirty : true;
    }
}
