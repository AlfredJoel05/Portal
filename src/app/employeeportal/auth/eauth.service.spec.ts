import { TestBed } from '@angular/core/testing';

import { EmployeeAuthService } from './eauth.service';

describe('AuthService', () => {
  let service: EmployeeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
