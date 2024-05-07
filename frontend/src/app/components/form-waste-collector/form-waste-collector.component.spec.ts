import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWasteCollectorComponent } from './form-waste-collector.component';

describe('FormWasteCollectorComponent', () => {
  let component: FormWasteCollectorComponent;
  let fixture: ComponentFixture<FormWasteCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormWasteCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormWasteCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
