import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeWasteCollectorComponent } from './home-waste-collector.component';

describe('HomeWasteCollectorComponent', () => {
  let component: HomeWasteCollectorComponent;
  let fixture: ComponentFixture<HomeWasteCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeWasteCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeWasteCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
