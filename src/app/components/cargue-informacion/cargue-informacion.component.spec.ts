import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargueInformacionComponent } from './cargue-informacion.component';

describe('CargueInformacionComponent', () => {
  let component: CargueInformacionComponent;
  let fixture: ComponentFixture<CargueInformacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargueInformacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargueInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
