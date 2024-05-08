import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBaseComponent } from './form-base.component';

describe('FormBaseComponent', () => {
  let component: FormBaseComponent;
  let fixture: ComponentFixture<FormBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
