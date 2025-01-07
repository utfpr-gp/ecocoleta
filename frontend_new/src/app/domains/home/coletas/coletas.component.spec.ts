import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColetasComponent } from './coletas.component';

describe('ColetasComponent', () => {
  let component: ColetasComponent;
  let fixture: ComponentFixture<ColetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColetasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
