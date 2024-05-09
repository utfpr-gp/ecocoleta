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
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {}

  click() {
    this.buttonClick.emit();
  }
}
