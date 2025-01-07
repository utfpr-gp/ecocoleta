import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteCollectorComponent } from './waste-collector.component';

describe('WasteCollectorComponent', () => {
  let component: WasteCollectorComponent;
  let fixture: ComponentFixture<WasteCollectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteCollectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WasteCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
