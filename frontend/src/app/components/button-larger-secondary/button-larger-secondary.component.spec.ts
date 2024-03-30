import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonLargerSecondaryComponent } from './button-larger-secondary.component';

describe('ButtonLargerSecondaryComponent', () => {
  let component: ButtonLargerSecondaryComponent;
  let fixture: ComponentFixture<ButtonLargerSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonLargerSecondaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonLargerSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
