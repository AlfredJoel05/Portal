import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAdminLayoutComponent } from './vadmin-layout.component';

describe('VendorAdminLayoutComponent', () => {
  let component: VendorAdminLayoutComponent;
  let fixture: ComponentFixture<VendorAdminLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorAdminLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorAdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
