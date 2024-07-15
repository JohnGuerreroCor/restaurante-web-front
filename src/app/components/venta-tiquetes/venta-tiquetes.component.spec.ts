import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaTiquetesComponent } from './venta-tiquetes.component';

describe('VentaTiquetesComponent', () => {
  let component: VentaTiquetesComponent;
  let fixture: ComponentFixture<VentaTiquetesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentaTiquetesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaTiquetesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
