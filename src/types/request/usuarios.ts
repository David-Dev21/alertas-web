/**
 * Tipos de entrada (requests) para el módulo de usuarios del panel
 */

export interface RolUsuarioPanel {
  nombre: string;
  permisos: string[];
  modulos: string[];
}

export interface CrearUsuarioPanelRequest {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  rol: RolUsuarioPanel;
}

export interface RegistrarTokenFCMRequest {
  fcmToken: string;
  infoDispositivo?: {
    navegador?: string;
    sistemaOperativo?: string;
    dispositivo?: string;
  };
}
