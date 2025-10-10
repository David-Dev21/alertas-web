// Tipos de respuesta para el módulo de notificaciones

import { RespuestaBase } from "@/types/common.types";

export interface NotificacionFCM {
  notification?: {
    title: string;
    body: string;
    icon?: string;
    image?: string;
  };
  data?: {
    [key: string]: string;
  };
  fcmMessageId?: string;
}

export interface DispositivoInfo {
  navegador?: string;
  sistemaOperativo?: string;
  dispositivo?: string;
}

export interface TokenFCMBackend {
  id: number;
  funcionarioId: number;
  token: string;
  dispositivoInfo?: DispositivoInfo;
  activo: boolean;
  fechaRegistro: string;
  ultimoUso?: string;
}

// Tipos de respuesta que podrían usarse en el futuro
export interface RespuestaTokensFCM extends RespuestaBase<TokenFCMBackend[]> {}
export interface RespuestaNotificacionFCM extends RespuestaBase<NotificacionFCM> {}
