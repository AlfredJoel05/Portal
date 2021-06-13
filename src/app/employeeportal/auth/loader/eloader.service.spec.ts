import { TestBed } from '@angular/core/testing';

import { EmployeeLoaderService } from './eloader.service';

describe('EmployeeLoaderService', () => {
  let service: EmployeeLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
