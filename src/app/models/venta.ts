import { Contrato } from "./contrato";
import { Persona } from "./persona";
import { Sede } from "./sede";
import { TipoServicio } from "./tipoServicio";

export class Venta {
    codigo!: string;
    persona!: Persona;
    tipoServicio!: TipoServicio;
    contrato!: Contrato;
    dependencia!: Sede;
    estado!: number;
    fecha!: string;
    hora!: string;
}