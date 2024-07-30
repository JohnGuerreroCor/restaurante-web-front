import { TestBed } from '@angular/core/testing';

import { EstadisticaRestauranteService } from './estadistica-restaurante.service';

describe('EstadisticaRestauranteService', () => {
  let service: EstadisticaRestauranteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticaRestauranteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
