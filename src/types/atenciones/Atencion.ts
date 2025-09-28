import { UbicacionGeografica } from '../alertas/Alerta';

export enum RolAtencion {
  ENCARGADO = 'ENCARGADO',
  APOYO = 'APOYO',
  OBSERVADOR = 'OBSERVADOR',
}

export interface FuncionarioAtencion {
  idUsuarioOperativo: string;
  rolAtencion: RolAtencion;
  ubicacion?: UbicacionGeografica;
  turnoInicio: string;
  turnoFin: string;
}

export interface CrearAtencionRequest {
  idAlerta: string;
  idUsuarioAdmin: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioAtencion[];
}

export interface AtencionResponse {
  id: string;
  idAlerta: string;
  idUsuarioAdmin: string;
  siglaVehiculo?: string;
  siglaRadio?: string;
  funcionarios: FuncionarioAtencion[];
  creadoEn: string;
  actualizadoEn: string;
}

// Nuevos tipos para la respuesta de funcionarios asignados
export interface FuncionarioOperativo {
  idUsuarioOperativo: string;
  grado: string;
  nombreCompleto: string;
  rolOperativo: string;
  ubicacion?: UbicacionGeografica;
}

export interface AtencionFuncionariosResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: {
    idUsuarioAdmin: string;
    nombreCompleto: string;
    grado: string;
    siglaVehiculo: string;
    siglaRadio: string;
    creadoEn: string;
    funcionariosOperativos: FuncionarioOperativo[];
  };
}

export interface FuncionarioExternoAtencion {
  rolAtencion: RolAtencion;
  ubicacion?: UbicacionGeografica;
  turnoInicio: string;
  turnoFin: string;
  funcionarioExterno: {
    grado: string;
    nombreCompleto: string;
    organismo: string;
    unidad: string;
  };
}

export interface CrearAtencionExternaRequest {
  idAlerta: string;
  idUsuarioAdmin: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioExternoAtencion[];
}

export interface AtencionExternaResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
}
