import api from "@/services/baseApi";
import { ParametrosConsultaVictimas } from "@/types/request/victimas";
import { RespuestaVictimas } from "@/types/response/victimas";

export const victimasService = {
  obtenerTodas: async (parametros: ParametrosConsultaVictimas = {}): Promise<RespuestaVictimas> => {
    const response = await api.get("/victimas", { params: parametros });
    return response.data;
  },
};
