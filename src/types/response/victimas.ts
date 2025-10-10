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
  fechaNacimiento: string;
  celular: string;
  correo: string;
  idMunicipio?: number;
  direccion?: Direccion;
  fechaRegistro: string;
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

export interface RespuestaVictimas extends RespuestaBase<DatosVictimas> {}
