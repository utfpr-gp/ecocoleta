import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentCollectComponent } from './current-collect.component';

describe('CurrentCollectComponent', () => {
  let component: CurrentCollectComponent;
  let fixture: ComponentFixture<CurrentCollectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentCollectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
