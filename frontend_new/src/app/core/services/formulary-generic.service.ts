import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormularyGenericService {
  private forms: Map<string, FormGroup> = new Map();

  constructor() {}

  getForm(key: string): FormGroup | null {
    console.log('log fomrulary get:', key);
    console.log('log fomrulary get return:', this.forms.get(key));
    return this.forms.get(key) || null;
  }

  setForm(key: string, form: FormGroup): void {
    console.log('log fomrulary set:', key, form);
    this.forms.set(key, form);
  }

  removeForm(key: string): void {
    this.forms.delete(key);
  }

  clearForms(): void {
    this.forms.clear();
  }
}
