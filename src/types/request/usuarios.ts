/**
 * Tipos de entrada (requests) para el módulo de usuarios del panel
 */

export interface ModuloUsuarioPanel {
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
}

export interface AutorizacionUsuarioPanel {
  rol: string;
  permisos: string[];
  modulos: ModuloUsuarioPanel[];
}

export interface CrearUsuarioPanelRequest {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  idDepartamento: number;
  autorizacion: AutorizacionUsuarioPanel;
}

export interface RegistrarTokenFCMRequest {
  fcmToken: string;
  infoDispositivo?: {
    navegador?: string;
    sistemaOperativo?: string;
    dispositivo?: string;
  };
}
