import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColetasHistoricoComponent } from './coletas-historico.component';

describe('ColetasHistoricoComponent', () => {
  let component: ColetasHistoricoComponent;
  let fixture: ComponentFixture<ColetasHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColetasHistoricoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ColetasHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
