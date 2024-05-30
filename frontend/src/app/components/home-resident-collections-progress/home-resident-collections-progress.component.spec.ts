import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResidentCollectionsProgressComponent } from './home-resident-collections-progress.component';

describe('HomeResidentCollectionsProgressComponent', () => {
  let component: HomeResidentCollectionsProgressComponent;
  let fixture: ComponentFixture<HomeResidentCollectionsProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResidentCollectionsProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeResidentCollectionsProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
