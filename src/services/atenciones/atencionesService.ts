import api from "../baseApi";
import { CrearAtencionRequest } from "@/types/request/atenciones";
import { AtencionResponse, AtencionFuncionariosResponse } from "@/types/response/atenciones";

export const atencionesService = {
  crearAtencion: async (data: CrearAtencionRequest): Promise<AtencionResponse> => {
    const response = await api.post("/atenciones", data);
    return response.data;
  },
};
