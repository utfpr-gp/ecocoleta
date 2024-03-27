import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDefaultComponent } from './login-default.component';

describe('LoginDefaultComponent', () => {
  let component: LoginDefaultComponent;
  let fixture: ComponentFixture<LoginDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDefaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
