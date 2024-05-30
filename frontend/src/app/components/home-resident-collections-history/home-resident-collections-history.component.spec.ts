import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeResidentCollectionsHistoryComponent } from './home-resident-collections-history.component';

describe('HomeResidentCollectionsHistoryComponent', () => {
  let component: HomeResidentCollectionsHistoryComponent;
  let fixture: ComponentFixture<HomeResidentCollectionsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeResidentCollectionsHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeResidentCollectionsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
