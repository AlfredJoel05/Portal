import { TestBed } from '@angular/core/testing';

import { VendorLoaderService } from './vloader.service';

describe('VendorLoaderService', () => {
  let service: VendorLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
