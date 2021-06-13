import { TestBed } from '@angular/core/testing';

import { EmployeeprofileService } from './employeeprofile.service';

describe('EmployeeprofileService', () => {
  let service: EmployeeprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
