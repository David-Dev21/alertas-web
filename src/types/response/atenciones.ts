import type { RespuestaBase } from "../common.types";
import { UbicacionPoint } from "../alertas/Alerta";
import { FuncionarioAtencion, FuncionarioOperativo, RolAtencion } from "../request/atenciones";

/**
 * Tipos de salida (responses) para el módulo de atenciones
 */

export interface AtencionFuncionario {
  id: string;
  idAtencion: string;
  idFuncionario: string;
  ubicacion: UbicacionPoint;
  turnoServicio: string;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
  rutaFuncionario?: RutaFuncionario;
}

export interface RutaFuncionario {
  id: string;
  idAtencionFuncionario: string;
  ruta: any; // Geography LineString
  precisionGps?: number;
  realizado?: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

export interface AtencionResponse
  extends RespuestaBase<{
    id: string;
    idAlerta: string;
    idUsuarioPanel: string;
    siglaVehiculo?: string;
    siglaRadio?: string;
    funcionarios: FuncionarioAtencion[];
    creadoEn: string;
    actualizadoEn: string;
  }> {}

export interface AtencionFuncionariosResponse
  extends RespuestaBase<{
    idUsuarioPanel: string;
    nombreCompleto: string;
    grado: string;
    siglaVehiculo: string;
    siglaRadio: string;
    creadoEn: string;
    funcionariosOperativos: FuncionarioOperativo[];
  }> {}

export interface AtencionExternaResponse extends RespuestaBase {}
