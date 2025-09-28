// Interfaces para el módulo de solicitudes de cancelación

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
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  motivoCancelacion: string;
  victima: VictimaSolicitud;
}

export interface PaginacionSolicitudesCancelacion {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface RespuestaSolicitudesCancelacion {
  solicitudes: SolicitudCancelacion[];
  paginacion: PaginacionSolicitudesCancelacion;
}

export interface ParametrosConsultaSolicitudesCancelacion {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
}
