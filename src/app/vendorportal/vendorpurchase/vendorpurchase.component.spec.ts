import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpurchaseComponent } from './vendorpurchase.component';

describe('VendorpurchaseComponent', () => {
  let component: VendorpurchaseComponent;
  let fixture: ComponentFixture<VendorpurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorpurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
