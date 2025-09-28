import apiBase, { ErrorApi } from '@/services/baseApi';
import { Victima, CrearVictima, ActualizarVictima, RespuestaVictimas, ParametrosConsultaVictimas } from '@/types/victimas/Victima';

// Re-exportar ErrorApi para compatibilidad
export { ErrorApi as ApiError };

// Interface para la respuesta estándar de la API
interface RespuestaApi<T> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: T;
}

/**
 * Servicio para manejo de víctimas usando la base API centralizada
 */
export const victimasService = {
  /**
   * Obtiene todas las víctimas con paginación y filtros
   */
  obtenerTodas: async (parametros: ParametrosConsultaVictimas = {}): Promise<RespuestaVictimas> => {
    try {
      const { pagina = 1, limite = 10, ...filtros } = parametros;

      const response = await apiBase.get<RespuestaApi<RespuestaVictimas>>('/victimas', {
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
      console.error('Error al obtener víctimas:', error);
      // Retornar estructura vacía en caso de error
      return {
        victimas: [],
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
   * Obtiene una víctima específica por ID
   */
  obtenerPorId: async (id: string): Promise<Victima> => {
    const response = await apiBase.get<RespuestaApi<Victima>>(`/victimas/${id}`);

    if (!response.data.exito) {
      throw new ErrorApi(response.data.codigo, response.data.mensaje);
    }

    return response.data.datos;
  },

  /**
   * Busca víctimas por término de búsqueda
   */
  buscar: async (termino: string, parametros: ParametrosConsultaVictimas = {}): Promise<RespuestaVictimas> => {
    return victimasService.obtenerTodas({
      ...parametros,
      busqueda: termino,
    });
  },

  /**
   * Crea una nueva víctima
   */
  crear: async (data: CrearVictima): Promise<Victima> => {
    const response = await apiBase.post<RespuestaApi<Victima>>('/victimas', data);

    if (!response.data.exito) {
      throw new ErrorApi(response.data.codigo, response.data.mensaje);
    }

    return response.data.datos;
  },

  /**
   * Actualiza una víctima existente
   */
  actualizar: async (id: string, data: ActualizarVictima): Promise<Victima> => {
    const response = await apiBase.patch<RespuestaApi<Victima>>(`/victimas/${id}`, data);

    if (!response.data.exito) {
      throw new ErrorApi(response.data.codigo, response.data.mensaje);
    }

    return response.data.datos;
  },

  /**
   * Elimina una víctima
   */
  eliminar: async (id: string): Promise<boolean> => {
    const response = await apiBase.delete<RespuestaApi<{ eliminado: boolean }>>(`/victimas/${id}`);

    if (!response.data.exito) {
      throw new ErrorApi(response.data.codigo, response.data.mensaje);
    }

    return response.data.datos.eliminado;
  },

  /**
   * Valida el teléfono de una víctima
   */
  validarTelefono: async (id: string): Promise<Victima> => {
    const response = await apiBase.patch<RespuestaApi<Victima>>(`/victimas/${id}/validar-telefono`);

    if (!response.data.exito) {
      throw new ErrorApi(response.data.codigo, response.data.mensaje);
    }

    return response.data.datos;
  },

  /**
   * Obtiene estadísticas básicas de víctimas
   */
  obtenerEstadisticas: async (): Promise<{
    totalVictimas: number;
    telefonosValidados: number;
    porcentajeValidacion: number;
  }> => {
    try {
      const response = await apiBase.get<
        RespuestaApi<{
          totalVictimas: number;
          telefonosValidados: number;
          porcentajeValidacion: number;
        }>
      >('/victimas/estadisticas');

      if (!response.data.exito) {
        throw new ErrorApi(response.data.codigo, response.data.mensaje);
      }

      return response.data.datos;
    } catch (error) {
      console.warn('Error al obtener estadísticas de víctimas:', error);
      return {
        totalVictimas: 0,
        telefonosValidados: 0,
        porcentajeValidacion: 0,
      };
    }
  },
};
