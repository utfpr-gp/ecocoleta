import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormularyService {
  formBase: FormGroup | null = null;

  getRegister(): FormGroup | null {
    console.log('log fomrulary formbase get:', this.formBase);
    return this.formBase;
  }

  setRegister(form: FormGroup) {
    console.log('log fomrulary formbase set:', form);
    this.formBase = form;
  }

  constructor() {}
}
