import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicHost]',
  standalone: true,
})
export class DynamicHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
