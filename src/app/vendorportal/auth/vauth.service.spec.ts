import { TestBed } from '@angular/core/testing';

import { VendorAuthService } from './vauth.service';

describe('AuthService', () => {
  let service: VendorAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
