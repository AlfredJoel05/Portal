import { TestBed } from '@angular/core/testing';

import { VendorGuardGuard } from './vendor-guard.guard';

describe('VendorGuardGuard', () => {
  let guard: VendorGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VendorGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
