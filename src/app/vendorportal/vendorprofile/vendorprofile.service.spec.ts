import { TestBed } from '@angular/core/testing';

import { VendorprofileService } from './vendorprofile.service';

describe('VendorprofileService', () => {
  let service: VendorprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
