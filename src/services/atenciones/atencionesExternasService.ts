import api from "../baseApi";
import { CrearAtencionExternaRequest, AgregarFuncionarioExternoRequest } from "@/types/request/atenciones";
import { AtencionExternaResponse } from "@/types/response/atenciones";

export const atencionesExternasService = {
  crearAtencionExterna: async (data: CrearAtencionExternaRequest): Promise<AtencionExternaResponse> => {
    const response = await api.post("/atenciones-externos", data);
    return response.data;
  },

  agregarFuncionarioExterno: async (idAtencion: string, data: AgregarFuncionarioExternoRequest): Promise<AtencionExternaResponse> => {
    const response = await api.post(`/atenciones-externos/${idAtencion}/funcionarios-externos`, data);
    return response.data;
  },
};
