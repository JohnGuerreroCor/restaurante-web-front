import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { InstructivoComponent } from './components/instructivo/instructivo.component';
import { VentaTiquetesComponent } from './components/venta-tiquetes/venta-tiquetes.component';
import { CargueInformacionComponent } from './components/cargue-informacion/cargue-informacion.component';
import { ConsumoTiquetesComponent } from './components/consumo-tiquetes/consumo-tiquetes.component';
import { TiquetesQrComponent } from './components/tiquetes-qr/tiquetes-qr.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { EstadisticaComponent } from './components/estadistica/estadistica.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  { path: 'login', component: LoginComponent },
  { path: 'token', component: TokenComponent },

  { path: 'inicio', component: InicioComponent },

  { path: 'instructivo', component: InstructivoComponent },

  { path: 'ventaTiquetes', component: VentaTiquetesComponent },
  { path: 'consumoTiquetes', component: ConsumoTiquetesComponent },
  { path: 'cargueInformacion', component: CargueInformacionComponent },
  { path: 'tiqueteQR', component: TiquetesQrComponent },
  { path: 'acceso-denegado', component: NotfoundComponent },

  { path: 'estadisticas-restaurante', component: EstadisticaComponent },

  { path: '**', redirectTo: 'acceso-denegado' },
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
export class AppRoutingModule {}
