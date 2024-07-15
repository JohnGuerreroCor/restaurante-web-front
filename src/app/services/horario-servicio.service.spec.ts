import { TestBed } from '@angular/core/testing';

import { HorarioServicioService } from './horario-servicio.service';

describe('HorarioServicioService', () => {
  let service: HorarioServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
