import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormularyService {
  formBase: FormGroup | null = null;

  getRegister(): FormGroup | null {
    return this.formBase;
  }

  setRegister(form: FormGroup) {
    this.formBase = form;
  }

  constructor() {}
}
