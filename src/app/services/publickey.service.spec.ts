import { TestBed } from '@angular/core/testing';

import { PublickeyService } from './publickey.service';

describe('PublickeyService', () => {
  let service: PublickeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublickeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
