import { Persona } from "./persona";
import { TipoGabu } from "./tipoGabu";

export class GrupoGabu {
    codigo!: number;
    tipoGabu!: TipoGabu;
    persona!: Persona;
    codigoEstudiante!: number;
    vigencia!: string;
    estado!: number;
}