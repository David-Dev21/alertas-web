// Tipos de respuesta para el módulo de solicitudes de cancelación

import { RespuestaBase } from "@/types/common.types";

export enum EstadoSolicitudCancelacion {
  PENDIENTE = "PENDIENTE",
  APROBADA = "APROBADA",
  RECHAZADA = "RECHAZADA",
}

export interface VictimaSolicitud {
  id: string;
  nombres: string;
  apellidos: string;
  cedulaIdentidad: string;
  celular: string;
}

export interface SolicitudCancelacion {
  id: string;
  idAlerta: string;
  fechaSolicitud: string;
  estadoSolicitud: EstadoSolicitudCancelacion;
  motivoCancelacion: string;
  victima: VictimaSolicitud;
}

export interface PaginacionSolicitudesCancelacion {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface RespuestaSolicitudesCancelacion
  extends RespuestaBase<{
    solicitudes: SolicitudCancelacion[];
    paginacion: PaginacionSolicitudesCancelacion;
  }> {}

export interface RespuestaDetalleSolicitudCancelacion
  extends RespuestaBase<{
    fechaSolicitud: string;
    estadoSolicitud: "PENDIENTE" | "APROBADA" | "RECHAZADA";
    motivoCancelacion: string;
    usuarioAprobador: string;
    victima: {
      id: string;
      nombres: string;
      apellidos: string;
      celular: string;
      cedulaIdentidad: string;
    };
  }> {}
