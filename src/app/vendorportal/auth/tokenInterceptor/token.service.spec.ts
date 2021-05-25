import { TestBed } from '@angular/core/testing';

import { VendorTokenService } from './token.service';

describe('VendorTokenService', () => {
  let service: VendorTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
