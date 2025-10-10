/**
 * Tipos de entrada (requests) para el módulo de alertas
 */

export interface DatosCrearAgresor {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
}

export interface DatosCierreAlerta {
  usuarioAdmin: string;
  fechaHora: string;
  estadoVictima: string;
  idAgresor?: string | null;
  motivoCierre: string;
  observaciones: string;
}

export interface ParametrosHistorial {
  pagina?: number;
  limite?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  municipio?: string;
}
