import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-larger-green',
  standalone: true,
  imports: [],
  templateUrl: './button-larger-green.component.html',
  styleUrl: './button-larger-green.component.scss',
})
export class ButtonLargerGreenComponent implements OnInit {
  @Input() btnText: string = '';
  @Input() disabledBtn: boolean = false;
  @Output('submit') onSubmit = new EventEmitter();
  @Output('navigate') onNavigate = new EventEmitter();

  submit() {
    this.onSubmit.emit();
  }

  navigate() {
    this.onNavigate.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}
