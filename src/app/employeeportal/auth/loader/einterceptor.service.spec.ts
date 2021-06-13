import { TestBed } from '@angular/core/testing';

import { EmployeeInterceptorService } from './einterceptor.service';

describe('InterceptorService', () => {
  let service: EmployeeInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
