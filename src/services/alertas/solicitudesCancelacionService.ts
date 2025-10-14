import api from "../baseApi";
import { EstadoSolicitudCancelacion } from "@/types/enums";
// Interfaces locales para el servicio

// De request/solicitudes-cancelacion.ts
interface ParametrosConsultaSolicitudesCancelacion {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  estado?: "PENDIENTE" | "APROBADA" | "RECHAZADA";
}

interface DatosActualizarEstadoSolicitud {
  idUsuarioWeb: string;
  estadoSolicitud: "APROBADA" | "RECHAZADA";
  motivoCancelacion: string;
}

// De response/solicitudes-cancelacion.ts
// Enum movido a src/types/enums.ts

interface VictimaSolicitud {
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

interface PaginacionSolicitudesCancelacion {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

// Tipo de datos que devuelve
interface DatosSolicitudesCancelacion {
  solicitudes: SolicitudCancelacion[];
  paginacion: PaginacionSolicitudesCancelacion;
}

// Tipo de datos que devuelve
export interface DatosDetalleSolicitudCancelacion {
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
}

export const solicitudesCancelacionService = {
  actualizarEstado: async (id: string, datos: DatosActualizarEstadoSolicitud): Promise<void> => {
    await api.put(`/solicitudes-cancelacion/${id}`, datos);
  },

  obtenerTodas: async (parametros: ParametrosConsultaSolicitudesCancelacion = {}): Promise<DatosSolicitudesCancelacion> => {
    const response = await api.get("/solicitudes-cancelacion", { params: parametros });
    return response.data;
  },

  obtenerDetalle: async (id: string): Promise<DatosDetalleSolicitudCancelacion> => {
    const response = await api.get(`/solicitudes-cancelacion/${id}/detalle`);
    return response.data;
  },
};
