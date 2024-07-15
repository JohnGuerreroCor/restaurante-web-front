import { TestBed } from '@angular/core/testing';

import { GrupoGabuService } from './grupo-gabu.service';

describe('GrupoGabuService', () => {
  let service: GrupoGabuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupoGabuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
