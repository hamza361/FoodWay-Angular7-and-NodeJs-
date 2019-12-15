import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneVerfPt1Component } from './phone-verf-pt1.component';

describe('PhoneVerfPt1Component', () => {
  let component: PhoneVerfPt1Component;
  let fixture: ComponentFixture<PhoneVerfPt1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneVerfPt1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneVerfPt1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
