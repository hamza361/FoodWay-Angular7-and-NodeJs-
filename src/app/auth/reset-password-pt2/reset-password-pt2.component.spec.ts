import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPt2Component } from './reset-password-pt2.component';

describe('ResetPasswordPt2Component', () => {
  let component: ResetPasswordPt2Component;
  let fixture: ComponentFixture<ResetPasswordPt2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordPt2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordPt2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
