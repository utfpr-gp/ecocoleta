import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLargerGreenComponent } from './button-larger-green.component';

describe('ButtonLargerGreenComponent', () => {
  let component: ButtonLargerGreenComponent;
  let fixture: ComponentFixture<ButtonLargerGreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLargerGreenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonLargerGreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
