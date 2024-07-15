import { TestBed } from '@angular/core/testing';

import { DiaBeneficioService } from './dia-beneficio.service';

describe('DiaBeneficioService', () => {
  let service: DiaBeneficioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaBeneficioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
