import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBtnNavComponent } from './footer-btn-nav.component';

describe('FooterBtnNavComponent', () => {
  let component: FooterBtnNavComponent;
  let fixture: ComponentFixture<FooterBtnNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterBtnNavComponent]
    });
    fixture = TestBed.createComponent(FooterBtnNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
