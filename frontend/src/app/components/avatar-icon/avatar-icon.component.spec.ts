import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarIconComponent } from './avatar-icon.component';

describe('AvatarIconComponent', () => {
  let component: AvatarIconComponent;
  let fixture: ComponentFixture<AvatarIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvatarIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
