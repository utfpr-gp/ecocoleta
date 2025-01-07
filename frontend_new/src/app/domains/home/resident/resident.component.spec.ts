import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentComponent } from './resident.component';

describe('ResidentComponent', () => {
  let component: ResidentComponent;
  let fixture: ComponentFixture<ResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
