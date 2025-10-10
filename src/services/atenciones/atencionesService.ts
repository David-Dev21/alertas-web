import api from "../baseApi";
import { CrearAtencionRequest } from "@/types/request/atenciones";
import { AtencionResponse, AtencionFuncionariosResponse } from "@/types/response/atenciones";

export const atencionesService = {
  crearAtencion: async (data: CrearAtencionRequest): Promise<AtencionResponse> => {
    const response = await api.post("/atenciones", data);
    return response.data;
  },

  obtenerFuncionariosAsignados: async (idAlerta: string): Promise<AtencionFuncionariosResponse["datos"]> => {
    const response = await api.get(`/atenciones/${idAlerta}/funcionarios`);
    return response.data.datos;
  },
};
