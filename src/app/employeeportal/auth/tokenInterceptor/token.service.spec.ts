import { TestBed } from '@angular/core/testing';

import { EmployeeTokenService } from './token.service';

describe('EmployeeTokenService', () => {
  let service: EmployeeTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
