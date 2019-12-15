import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneVerfPt2Component } from './phone-verf-pt2.component';

describe('PhoneVerfPt2Component', () => {
  let component: PhoneVerfPt2Component;
  let fixture: ComponentFixture<PhoneVerfPt2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhoneVerfPt2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneVerfPt2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
