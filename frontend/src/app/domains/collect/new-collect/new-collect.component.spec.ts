import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCollectComponent } from './new-collect.component';

describe('NewCollectComponent', () => {
  let component: NewCollectComponent;
  let fixture: ComponentFixture<NewCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCollectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
