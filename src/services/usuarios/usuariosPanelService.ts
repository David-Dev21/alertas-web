import api from "@/services/baseApi";
import { RespuestaBase } from "@/types/common.types";
import type { CrearUsuarioPanelRequest, RegistrarTokenFCMRequest } from "@/types/request/usuarios";
import type { RespuestaObtenerUsuarioPanel } from "@/types/response/usuarios";

export const usuariosPanelService = {
  crearUsuarioPanel: async (data: CrearUsuarioPanelRequest): Promise<RespuestaBase> => {
    const response = await api.post("/usuarios-panel", data);
    return response.data;
  },

  obtenerUsuarioPanel: async (id: string): Promise<RespuestaObtenerUsuarioPanel> => {
    const response = await api.get(`/usuarios-panel/${id}`);
    return response.data;
  },

  registrarTokenFCM: async (idUsuario: string, data: RegistrarTokenFCMRequest): Promise<RespuestaBase> => {
    const response = await api.patch(`/usuarios-panel/${idUsuario}/token-fcm`, data);
    return response.data;
  },
};
