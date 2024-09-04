import { NgModule, isDevMode, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsCO from '@angular/common/locales/es-CO';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { MaterialModules } from './material.modules';

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

//QR
import { QRCodeModule } from 'angularx-qrcode';
import { InstructivoComponent } from './components/instructivo/instructivo.component';
import { VentaTiquetesComponent } from './components/venta-tiquetes/venta-tiquetes.component';
import { CargueInformacionComponent } from './components/cargue-informacion/cargue-informacion.component';
import { ConsumoTiquetesComponent } from './components/consumo-tiquetes/consumo-tiquetes.component';
import { TiquetesQrComponent } from './components/tiquetes-qr/tiquetes-qr.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { EstadisticaComponent } from './components/estadistica/estadistica.component';
import { VentaComponent } from './components/reportes/venta/venta.component';
import { ConsumoComponent } from './components/reportes/consumo/consumo.component';
import { ReportesComponent } from './components/reportes/reportes.component';

registerLocaleData(localeEsCO, 'es-CO');

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
    InstructivoComponent,
    VentaTiquetesComponent,
    CargueInformacionComponent,
    ConsumoTiquetesComponent,
    TiquetesQrComponent,
    NotfoundComponent,
    EstadisticaComponent,
    VentaComponent,
    ConsumoComponent,
    ReportesComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    QRCodeModule,
    ZXingScannerModule,
    MaterialModules,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    DatePipe,
    CheckForUpdateService,
    LogUpdateService,
    PromptUpdateService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [PromptNotificationService],
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: LOCALE_ID, useValue: 'es-CO' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
