import api from "@/services/baseApi";
import { RespuestaBase } from "@/types/common.types";
import type { CrearUsuarioPanelRequest, RegistrarTokenFCMRequest } from "@/types/request/usuarios";
import type { RespuestaObtenerUsuarioPanel } from "@/types/response/usuarios";

export const usuariosPanelService = {
  crearUsuarioPanel: async (data: CrearUsuarioPanelRequest): Promise<RespuestaBase> => {
    const response = await api.post("/usuarios-web", data);
    return response.data;
  },

  obtenerUsuarioPanel: async (id: string): Promise<RespuestaObtenerUsuarioPanel> => {
    const response = await api.get(`/usuarios-web/${id}`);
    return response.data;
  },

  registrarTokenFCM: async (idUsuario: string, data: RegistrarTokenFCMRequest): Promise<RespuestaBase> => {
    const response = await api.patch(`/usuarios-web/${idUsuario}/token-fcm`, data);
    return response.data;
  },
};
