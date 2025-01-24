import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectFormComponent } from './collect-form.component';

describe('CollectFormComponent', () => {
  let component: CollectFormComponent;
  let fixture: ComponentFixture<CollectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
