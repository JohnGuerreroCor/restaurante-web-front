import { TestBed } from '@angular/core/testing';

import { HoraServidorService } from './hora-servidor.service';

describe('HoraServidorService', () => {
  let service: HoraServidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoraServidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
