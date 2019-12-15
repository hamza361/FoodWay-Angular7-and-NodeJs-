import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveDiscountedDealsComponent } from './exclusive-discounted-deals.component';

describe('ExclusiveDiscountedDealsComponent', () => {
  let component: ExclusiveDiscountedDealsComponent;
  let fixture: ComponentFixture<ExclusiveDiscountedDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusiveDiscountedDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveDiscountedDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
