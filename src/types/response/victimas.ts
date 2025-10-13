// Tipos de respuesta para el módulo de víctimas

import { RespuestaBase } from "@/types/common.types";

export interface Direccion {
  zona: string;
  calle: string;
  numero: string;
  referencia: string;
}

export interface ContactoEmergencia {
  id?: string;
  parentesco: string;
  nombreCompleto: string;
  celular: string;
  principal: boolean;
}

export interface Victima {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto?: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string;
  celular: string;
  correo?: string;
  estadoCuenta?: string;
  creadoEn?: string;
  idMunicipio?: number;
  direccion?: Direccion;
  contactosEmergencia?: ContactoEmergencia[];
}

export interface PaginacionVictimas {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface DatosVictimas {
  victimas: Victima[];
  paginacion: PaginacionVictimas;
}

export interface RespuestaVictimas extends RespuestaBase<{ datos: DatosVictimas }> {}

export interface AlertaHistorial {
  idAlerta: string;
  fechaHora: string;
  estadoAlerta: string;
  origen: string;
  idMunicipio: number;
  codigoCud: string;
  codigoRegistro: string;
  tiempoAsignacion: string;
  tiempoCierre: string;
  creadoEn: string;
  municipio: string;
  provincia: string;
  departamento: string;
}

export interface EstadisticasVictima {
  totalAlertas: number;
  alertasActivas: number;
  alertasFinalizadas: number;
  alertasPorEstado: Record<string, number>;
}

export interface HistorialAlertasVictima {
  victima: Victima;
  estadisticas: EstadisticasVictima;
  alertas: AlertaHistorial[];
}

export interface RespuestaHistorialAlertasVictima extends RespuestaBase<HistorialAlertasVictima> {}
