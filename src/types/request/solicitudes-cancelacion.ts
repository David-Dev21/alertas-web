// Tipos de solicitud para el módulo de solicitudes de cancelación

export interface ParametrosConsultaSolicitudesCancelacion {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  estado?: "PENDIENTE" | "APROBADA" | "RECHAZADA";
}

export interface DatosActualizarEstadoSolicitud {
  usuarioAdmin: string;
  estadoSolicitud: "APROBADA" | "RECHAZADA";
  motivoCancelacion: string;
}
