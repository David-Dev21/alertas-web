import apiBase, { ErrorApi } from '@/services/baseApi';
import {
  SolicitudCancelacion,
  RespuestaSolicitudesCancelacion,
  ParametrosConsultaSolicitudesCancelacion,
} from '@/types/solicitudes-cancelacion/SolicitudCancelacion';

// Re-exportar ErrorApi para compatibilidad
export { ErrorApi as ApiError };

// Interface para la respuesta estándar de la API
interface RespuestaApi<T> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: T;
}

// Interface para el detalle de solicitud de cancelación
export interface DetalleSolicitudCancelacion {
  fechaSolicitud: string;
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
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

/**
 * Servicio para manejo de solicitudes de cancelación usando la base API centralizada
 */
export const solicitudesCancelacionService = {
  /**
   * Actualizar estado de una solicitud de cancelación
   */
  actualizarEstado: async (
    id: string,
    datos: {
      usuarioAdmin: string;
      estadoSolicitud: 'APROBADA' | 'RECHAZADA';
      motivoCancelacion: string;
    },
  ): Promise<void> => {
    try {
      const response = await apiBase.put(`/solicitudes-cancelacion/${id}`, datos);

      if (!response.data.exito) {
        throw new ErrorApi(response.data.codigo, response.data.mensaje);
      }
    } catch (error) {
      console.error('Error al actualizar solicitud de cancelación:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las solicitudes de cancelación con paginación y filtros
   */
  obtenerTodas: async (parametros: ParametrosConsultaSolicitudesCancelacion = {}): Promise<RespuestaSolicitudesCancelacion> => {
    try {
      const { pagina = 1, limite = 10, ...filtros } = parametros;

      const response = await apiBase.get<RespuestaApi<RespuestaSolicitudesCancelacion>>('/solicitudes-cancelacion', {
        params: {
          pagina,
          limite,
          ...filtros,
        },
      });

      if (!response.data.exito) {
        throw new ErrorApi(response.data.codigo, response.data.mensaje);
      }

      return response.data.datos;
    } catch (error) {
      console.error('Error al obtener solicitudes de cancelación:', error);
      // Retornar estructura vacía en caso de error
      return {
        solicitudes: [],
        paginacion: {
          paginaActual: 1,
          totalPaginas: 0,
          totalElementos: 0,
          elementosPorPagina: 10,
        },
      };
    }
  },

  /**
   * Obtiene el detalle de una solicitud de cancelación específica
   */
  obtenerDetalle: async (id: string): Promise<DetalleSolicitudCancelacion> => {
    try {
      const response = await apiBase.get<RespuestaApi<DetalleSolicitudCancelacion>>(`/solicitudes-cancelacion/${id}/detalle`);

      if (!response.data.exito) {
        throw new ErrorApi(response.data.codigo, response.data.mensaje);
      }

      return response.data.datos;
    } catch (error) {
      console.error('Error al obtener detalle de solicitud de cancelación:', error);
      throw error;
    }
  },
};
