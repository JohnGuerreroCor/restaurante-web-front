import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiquetesQrComponent } from './tiquetes-qr.component';

describe('TiquetesQrComponent', () => {
  let component: TiquetesQrComponent;
  let fixture: ComponentFixture<TiquetesQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiquetesQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiquetesQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
