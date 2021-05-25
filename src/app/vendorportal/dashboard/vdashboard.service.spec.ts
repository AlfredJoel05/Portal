import { TestBed } from '@angular/core/testing';

import { VednorDashboardService } from './vdashboard.service';

describe('VednorDashboardService', () => {
  let service: VednorDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VednorDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
