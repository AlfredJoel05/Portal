import { TestBed } from '@angular/core/testing';

import { EmployeeNavService } from './enav.service';

describe('NavService', () => {
  let service: EmployeeNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
