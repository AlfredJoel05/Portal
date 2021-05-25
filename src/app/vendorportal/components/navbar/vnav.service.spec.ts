import { TestBed } from '@angular/core/testing';

import { VendorNavService } from './vnav.service';

describe('NavService', () => {
  let service: VendorNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
