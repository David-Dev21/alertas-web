import api from "@/services/baseApi";
import { ParametrosConsultaVictimas } from "@/types/request/victimas";
import { RespuestaVictimas, RespuestaHistorialAlertasVictima } from "@/types/response/victimas";

export const victimasService = {
  obtenerTodas: async (parametros: ParametrosConsultaVictimas = {}): Promise<RespuestaVictimas> => {
    const response = await api.get("/victimas", { params: parametros });
    return response.data;
  },

  obtenerHistorialAlertas: async (idVictima: string): Promise<RespuestaHistorialAlertasVictima> => {
    const response = await api.get(`/victimas/${idVictima}/historial-alertas`);
    return response.data;
  },
};
