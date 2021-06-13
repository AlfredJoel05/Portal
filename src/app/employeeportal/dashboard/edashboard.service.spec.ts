import { TestBed } from '@angular/core/testing';

import { EmployeeDashboardService } from './edashboard.service';

describe('EmployeeDashboardService', () => {
  let service: EmployeeDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
