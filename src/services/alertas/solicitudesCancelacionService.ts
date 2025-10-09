import api from "../baseApi";
import { ParametrosConsultaSolicitudesCancelacion, DatosActualizarEstadoSolicitud } from "@/types/request/solicitudes-cancelacion";
import { RespuestaSolicitudesCancelacion, RespuestaDetalleSolicitudCancelacion } from "@/types/response/solicitudes-cancelacion";

export const solicitudesCancelacionService = {
  actualizarEstado: async (id: string, datos: DatosActualizarEstadoSolicitud): Promise<void> => {
    await api.put(`/solicitudes-cancelacion/${id}`, datos);
  },

  obtenerTodas: async (parametros: ParametrosConsultaSolicitudesCancelacion = {}): Promise<RespuestaSolicitudesCancelacion> => {
    const response = await api.get("/solicitudes-cancelacion", { params: parametros });
    return response.data;
  },

  obtenerDetalle: async (id: string): Promise<RespuestaDetalleSolicitudCancelacion> => {
    const response = await api.get(`/solicitudes-cancelacion/${id}/detalle`);
    return response.data;
  },
};
