import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWasteCollectorComponent } from './register-waste-collector.component';

describe('RegisterWasteCollectorComponent', () => {
  let component: RegisterWasteCollectorComponent;
  let fixture: ComponentFixture<RegisterWasteCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWasteCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterWasteCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
