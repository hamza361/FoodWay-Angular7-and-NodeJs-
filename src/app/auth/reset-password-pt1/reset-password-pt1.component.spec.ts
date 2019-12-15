import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPt1Component } from './reset-password-pt1.component';

describe('ResetPasswordPt1Component', () => {
  let component: ResetPasswordPt1Component;
  let fixture: ComponentFixture<ResetPasswordPt1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordPt1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPt1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
