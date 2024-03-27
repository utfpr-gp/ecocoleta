import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonLargerGreenComponent } from '../button-larger-green/button-larger-green.component';

@Component({
  selector: 'app-login-default',
  standalone: true,
  imports: [ButtonLargerGreenComponent],
  templateUrl: './login-default.component.html',
  styleUrl: './login-default.component.scss',
})
export class LoginDefaultComponent implements OnInit {
  @Input() title: string = '';

  //TODO passar submit parA ao pages/login
  submit() {
    console.log('Submit 1');
  }

  constructor() {}

  ngOnInit(): void {}
}
