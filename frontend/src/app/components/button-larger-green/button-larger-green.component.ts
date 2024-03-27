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
  @Output('submit') onSubmit = new EventEmitter();

  submit() {
    this.onSubmit.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}
