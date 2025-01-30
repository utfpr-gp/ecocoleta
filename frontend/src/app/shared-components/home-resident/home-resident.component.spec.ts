import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResidentComponent } from './home-resident.component';

describe('HomeResidentComponent', () => {
  let component: HomeResidentComponent;
  let fixture: ComponentFixture<HomeResidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResidentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeResidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
