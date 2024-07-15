import { Contrato } from "./contrato";
import { Persona } from "./persona";
import { Sede } from "./sede";
import { TipoServicio } from "./tipoServicio";
import { Venta } from "./venta";

export class Consumo {
    codigo!: string;
    persona!: Persona;
    venta!: Venta;
    tipoServicio!: TipoServicio;
    contrato!: Contrato;
    dependencia!: Sede;
    estado!: number;
    fecha!: string;
    hora!: string;
}