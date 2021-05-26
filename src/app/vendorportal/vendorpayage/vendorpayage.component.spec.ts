import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpayageComponent } from './vendorpayage.component';

describe('VendorpayageComponent', () => {
  let component: VendorpayageComponent;
  let fixture: ComponentFixture<VendorpayageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorpayageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorpayageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
