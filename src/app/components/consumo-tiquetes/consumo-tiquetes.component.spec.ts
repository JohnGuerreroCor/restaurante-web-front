import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumoTiquetesComponent } from './consumo-tiquetes.component';

describe('ConsumoTiquetesComponent', () => {
  let component: ConsumoTiquetesComponent;
  let fixture: ComponentFixture<ConsumoTiquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumoTiquetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumoTiquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
