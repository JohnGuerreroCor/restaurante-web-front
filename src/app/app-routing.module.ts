import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';
import { PublicoComponent } from './components/publico/publico.component';
import { VirtualComponent } from './components/virtual/virtual.component';
import { IntercambioComponent } from './components/intercambio/intercambio.component';
import { DocenteComponent } from './components/docente/docente.component';
import { GraduadoComponent } from './components/graduado/graduado.component';
import { AdministrativoComponent } from './components/administrativo/administrativo.component';
import { InstructivoComponent } from './components/instructivo/instructivo.component';
import { VentaTiquetesComponent } from './components/venta-tiquetes/venta-tiquetes.component';
import { CargueInformacionComponent } from './components/cargue-informacion/cargue-informacion.component';
import { ConsumoTiquetesComponent } from './components/consumo-tiquetes/consumo-tiquetes.component';
import { TiquetesQrComponent } from './components/tiquetes-qr/tiquetes-qr.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'inicio', component: InicioComponent },

  { path: 'publico', component: PublicoComponent },

  { path: 'estudiante', component: EstudianteComponent },
  { path: 'virtual', component: VirtualComponent },
  { path: 'intercambio', component: IntercambioComponent },
  { path: 'docente', component: DocenteComponent },
  { path: 'administrativo', component: AdministrativoComponent },
  { path: 'graduado', component: GraduadoComponent },

  { path: 'instructivo', component: InstructivoComponent },

  { path: 'ventaTiquetes', component: VentaTiquetesComponent },
  { path: 'consumoTiquetes', component: ConsumoTiquetesComponent },
  { path: 'cargueInformacion', component: CargueInformacionComponent },
  { path: 'tiqueteQR', component: TiquetesQrComponent },

  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
