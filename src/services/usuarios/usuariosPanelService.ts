import api from "@/services/baseApi";
import { RespuestaBase } from "@/types/common.types";

// Interfaces de request
interface ModuloUsuarioPanel {
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
}

interface AutorizacionUsuarioPanel {
  rol: string;
  permisos: string[];
  modulos: ModuloUsuarioPanel[];
}

interface CrearUsuarioPanelRequest {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  idDepartamento: number;
  autorizacion: AutorizacionUsuarioPanel;
}

interface RegistrarTokenFCMRequest {
  fcmToken: string;
  infoDispositivo?: {
    navegador?: string;
    sistemaOperativo?: string;
    dispositivo?: string;
  };
}

// Interfaces de response
interface UsuarioPanelResponse {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
}

export const usuariosPanelService = {
  crearUsuarioPanel: async (data: CrearUsuarioPanelRequest): Promise<RespuestaBase<void>> => {
    const response = await api.post("/usuarios-web", data);
    return response.data;
  },

  obtenerUsuarioPanel: async (id: string): Promise<RespuestaBase<{ usuario: UsuarioPanelResponse }>> => {
    const response = await api.get(`/usuarios-web/${id}`);
    return response.data;
  },

  registrarTokenFCM: async (idUsuario: string, data: RegistrarTokenFCMRequest): Promise<RespuestaBase<void>> => {
    const response = await api.patch(`/usuarios-web/${idUsuario}/token-fcm`, data);
    return response.data;
  },
};
