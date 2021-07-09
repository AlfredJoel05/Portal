import { TestBed } from '@angular/core/testing';

import { SucessService } from './sucess.service';

describe('SucessService', () => {
  let service: SucessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SucessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
