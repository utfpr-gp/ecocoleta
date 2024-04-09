import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterResidentComponent } from './register-resident.component';

describe('RegisterResidentComponent', () => {
  let component: RegisterResidentComponent;
  let fixture: ComponentFixture<RegisterResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterResidentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
