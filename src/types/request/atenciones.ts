import { UbicacionPoint } from "../alertas/Alerta";

/**
 * Tipos de entrada (requests) para el módulo de atenciones
 */

export enum RolAtencion {
  ENCARGADO = "ENCARGADO",
  APOYO = "APOYO",
  OBSERVADOR = "OBSERVADOR",
}

export interface FuncionarioOperativo {
  idUsuarioOperativo: string;
  grado: string;
  nombreCompleto: string;
  rolOperativo: string;
  ubicacion?: UbicacionPoint;
}

export interface FuncionarioAtencion {
  idUsuarioOperativo: string;
  rolAtencion: RolAtencion;
  ubicacion?: UbicacionPoint;
  turnoInicio: string;
  turnoFin: string;
}

export interface CrearAtencionRequest {
  idAlerta: string;
  idUsuarioPanel: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioAtencion[];
}

export interface FuncionarioExternoAtencion {
  rolAtencion: RolAtencion;
  ubicacion?: UbicacionPoint;
  turnoInicio: string;
  turnoFin: string;
  funcionarioExterno: {
    grado: string;
    nombreCompleto: string;
    organismo?: string;
    unidad: string;
  };
}

export interface AgregarFuncionarioExternoRequest {
  rolAtencion: RolAtencion;
  ubicacion?: {
    longitud: number;
    latitud: number;
    precision: number;
    marcaTiempo: string;
  };
  turnoInicio: string;
  turnoFin: string;
  idPersonal: string;
}

export interface CrearAtencionExternaRequest {
  idAlerta: string;
  idUsuarioPanel: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioExternoAtencion[];
}
