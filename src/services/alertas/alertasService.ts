import apiBase, { ErrorApi } from '@/services/baseApi';
import { Alerta, CrearAlerta } from '@/types/alertas/Alerta';

// Re-exportar ErrorApi para compatibilidad
export { ErrorApi as ApiError };

interface RespuestaApi<T> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: T;
}

export const alertasService = {
  obtenerPorId: async (id: string): Promise<Alerta> => {
    const response = await apiBase.get<RespuestaApi<{ alerta: Alerta }>>(`/alertas/${id}/detalle`);
    return response.data.datos.alerta;
  },

  /**
   * Obtiene alertas activas (PENDIENTE, ASIGNADA, EN_ATENCION)
   */
  obtenerActivas: async (
    filtros: {
      idDepartamento?: number;
      idProvincia?: number;
      idMunicipio?: number;
    } = {},
  ): Promise<Alerta[]> => {
    try {
      const { idDepartamento, idProvincia, idMunicipio } = filtros;

      const response = await apiBase.get<RespuestaApi<Alerta[]>>('/alertas/alertas-activas', {
        params: {
          ...(idDepartamento && { idDepartamento }),
          ...(idProvincia && { idProvincia }),
          ...(idMunicipio && { idMunicipio }),
        },
      });

      // Verificar que la respuesta sea exitosa
      if (!response.data.exito) {
        throw new ErrorApi(response.data.codigo, response.data.mensaje);
      }

      // La API retorna { datos: { alertas: Alerta[], totalAlertas: number } }
      // Extraer el array de alertas si existe
      const datos = response.data.datos as any;
      if (datos && Array.isArray(datos.alertas)) {
        return datos.alertas as Alerta[];
      }

      return [];
    } catch (error) {
      console.warn('Error al obtener alertas activas, retornando array vacío:', error);
      return [];
    }
  },

  /**
   * Crea una nueva alerta
   */
  crear: async (data: CrearAlerta): Promise<Alerta> => {
    const response = await apiBase.post<Alerta>('/alertas', data);
    return response.data;
  },

  /**
   * Cierra una alerta con motivo
   */
  cerrar: async (idAlerta: string, datoCierre: any): Promise<Alerta> => {
    const response = await apiBase.post<RespuestaApi<{ alerta: Alerta }>>(`/cierre-alertas/${idAlerta}`, datoCierre);
    return response.data.datos.alerta;
  },

  /**
   * Busca un agresor por cédula
   */
  buscarAgresor: async (cedula: string): Promise<any> => {
    try {
      const response = await apiBase.get<RespuestaApi<any>>(`/cierre-alertas/agresores/${cedula}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar agresor:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo agresor
   */
  crearAgresor: async (datosAgresor: { cedulaIdentidad: string; nombres: string; apellidos: string; parentesco: string }): Promise<any> => {
    try {
      const response = await apiBase.post<RespuestaApi<any>>('/cierre-alertas/agresores', datosAgresor);
      return response.data;
    } catch (error) {
      console.error('Error al crear agresor:', error);
      throw error;
    }
  },
  /**
   * Obtiene historial de alertas con paginación y filtros/busqueda
   */
  obtenerHistorial: async (
    parametros: {
      pagina?: number;
      limite?: number;
      busqueda?: string;
      origen?: string;
      idMunicipio?: number;
      idProvincia?: number;
      idDepartamento?: number;
      fechaDesde?: string;
      fechaHasta?: string;
    } = {},
  ) => {
    try {
      const { pagina = 1, limite = 10, busqueda, origen, idMunicipio, idDepartamento, idProvincia, fechaDesde, fechaHasta } = parametros;

      console.log('Parámetros enviados al servicio:', {
        pagina,
        limite,
        busqueda,
        origen,
        idMunicipio,
        idProvincia,
        idDepartamento,
        fechaDesde,
        fechaHasta,
      });

      const response = await apiBase.get<any>(`/alertas/historial-alertas`, {
        params: {
          pagina,
          limite,
          ...(busqueda && { busqueda }),
          ...(origen && { origen }),
          ...(idMunicipio && { idMunicipio }),
          ...(idProvincia && { idProvincia }),
          ...(idDepartamento && { idDepartamento }),
          ...(fechaDesde && { fechaDesde }),
          ...(fechaHasta && { fechaHasta }),
        },
      });

      if (!response.data.exito) {
        throw new ErrorApi(response.data.codigo, response.data.mensaje);
      }

      return response.data.datos;
    } catch (error) {
      console.error('Error al obtener historial de alertas:', error);
      return { alertas: [], paginacion: { paginaActual: 1, totalPaginas: 0, totalElementos: 0, elementosPorPagina: 10 } };
    }
  },
};
