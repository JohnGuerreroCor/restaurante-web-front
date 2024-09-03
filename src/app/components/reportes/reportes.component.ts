import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent {
  links = [
    {
      titulo: 'Venta',
      ruta: '/reporte-ventas',
      icono: 'fa-solid fa-shop fa-8x p-4 text-center color-icon color-icon',
      info: 'Este módulo se encarga de establecer los horarios de venta y atención en el restaurante, garantizando una gestión eficiente del tiempo.',
    },
    {
      titulo: 'Consumo',
      ruta: '/reporte-consumos',
      icono: 'fa-solid fa-utensils fa-8x p-4 text-center color-icon',
      info: 'Actualmente en construcción, este módulo en el futuro será responsable de llevar un registro histórico de las ventas y consumos para un determinado día.',
    },
  ];
}
