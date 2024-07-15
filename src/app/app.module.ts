import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//ANGULAR MATERIAL
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

//COMPONENTES
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TokenComponent } from './components/token/token.component';

//SERVICIOS PWA
import { ServiceWorkerModule } from '@angular/service-worker';
import { PromptInstallComponent } from './components/prompt-install/prompt-install.component';
import { CheckForUpdateService } from './services/check-for-update.service';
import { LogUpdateService } from './services/log-update.service';
import { PromptUpdateService } from './services/prompt-update.service';
import { PromptNotificationService } from './services/promtp-notification.service';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { EstudianteComponent } from './components/estudiante/estudiante.component';

//QR
import { QRCodeModule } from 'angularx-qrcode';
import { VirtualComponent } from './components/virtual/virtual.component';
import { IntercambioComponent } from './components/intercambio/intercambio.component';
import { PublicoComponent } from './components/publico/publico.component';
import { DocenteComponent } from './components/docente/docente.component';
import { AdministrativoComponent } from './components/administrativo/administrativo.component';
import { GraduadoComponent } from './components/graduado/graduado.component';
import { InstructivoComponent } from './components/instructivo/instructivo.component';
import { VentaTiquetesComponent } from './components/venta-tiquetes/venta-tiquetes.component';
import { CargueInformacionComponent } from './components/cargue-informacion/cargue-informacion.component';
import { ConsumoTiquetesComponent } from './components/consumo-tiquetes/consumo-tiquetes.component';
import { TiquetesQrComponent } from './components/tiquetes-qr/tiquetes-qr.component';


const initializer =
  (promptNotificationService: PromptNotificationService) => () =>
    promptNotificationService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TokenComponent,
    PromptInstallComponent,
    NavbarComponent,
    InicioComponent,
    EstudianteComponent,
    VirtualComponent,
    IntercambioComponent,
    PublicoComponent,
    DocenteComponent,
    AdministrativoComponent,
    GraduadoComponent,
    InstructivoComponent,
    VentaTiquetesComponent,
    CargueInformacionComponent,
    ConsumoTiquetesComponent,
    TiquetesQrComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTreeModule,
    MatCheckboxModule,
    MatBottomSheetModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatCardModule,
    AppRoutingModule,
    QRCodeModule,
    MatSliderModule,
    MatTableModule,
    MatSortModule,
    MatRadioModule,
    MatNativeDateModule,
    ZXingScannerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    CheckForUpdateService,
    LogUpdateService,
    PromptUpdateService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [PromptNotificationService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
