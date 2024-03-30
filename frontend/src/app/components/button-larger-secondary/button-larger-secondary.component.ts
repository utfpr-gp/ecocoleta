import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button-larger-secondary',
  standalone: true,
  imports: [],
  templateUrl: './button-larger-secondary.component.html',
  styleUrl: './button-larger-secondary.component.scss',
})
export class ButtonLargerSecondaryComponent implements OnInit {
  @Input() btnText: string = '';
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
