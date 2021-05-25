import { TestBed } from '@angular/core/testing';

import { VendorInterceptorService } from './vinterceptor.service';

describe('InterceptorService', () => {
  let service: VendorInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
