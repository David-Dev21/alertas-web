import api from "@/services/baseApi";
import { Alerta } from "@/types/alertas/Alerta";
import { FiltrosUbicacion } from "@/types/alertas/Ubicacion";
import { DatosCrearAgresor, DatosCierreAlerta, ParametrosHistorial } from "@/types/request/alertas";
import { RespuestaBuscarAgresor, RespuestaCrearAgresor, RespuestaHistorialAlertas } from "@/types/response/alertas";

export const alertasService = {
  obtenerPorId: async (id: string): Promise<Alerta> => {
    const response = await api.get(`/alertas/${id}/detalle`);
    return response.data.datos.alerta;
  },

  obtenerActivas: async (filtros: FiltrosUbicacion = {}): Promise<Alerta[]> => {
    try {
      const response = await api.get("/alertas/alertas-activas", { params: filtros });
      const datos = response.data.datos;
      return datos?.alertas || [];
    } catch (error) {
      console.warn("Error al obtener alertas:", error);
      return [];
    }
  },

  cerrar: async (idAlerta: string, datoCierre: DatosCierreAlerta): Promise<Alerta> => {
    const response = await api.post(`/cierre-alertas/${idAlerta}`, datoCierre);
    return response.data.datos.alerta;
  },

  buscarAgresor: async (cedula: string): Promise<RespuestaBuscarAgresor> => {
    const response = await api.get(`/cierre-alertas/agresores/${cedula}`);
    return response.data;
  },

  crearAgresor: async (datosAgresor: DatosCrearAgresor): Promise<RespuestaCrearAgresor> => {
    const response = await api.post("/cierre-alertas/agresores", datosAgresor);
    return response.data;
  },

  obtenerHistorial: async (parametros: ParametrosHistorial = {}): Promise<RespuestaHistorialAlertas> => {
    try {
      const response = await api.get("/alertas/historial-alertas", { params: parametros });
      return response.data;
    } catch (error) {
      console.error("Error al obtener historial:", error);
      return {
        exito: false,
        mensaje: "Error al obtener historial",
        datos: {
          alertas: [],
          paginacion: { paginaActual: 1, totalPaginas: 0, totalElementos: 0, elementosPorPagina: 10 },
        },
      };
    }
  },
};
