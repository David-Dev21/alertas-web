/**
 * Enums centralizados para el sistema de alertas
 * Este archivo contiene todas las enumeraciones utilizadas en la aplicación
 */

// De alertas/Alerta.ts
export enum OrigenAlerta {
  ATT = "ATT",
  FELCV = "FELCV",
}

export enum EstadoAlerta {
  PENDIENTE = "PENDIENTE",
  ASIGNADA = "ASIGNADA",
  EN_ATENCION = "EN_ATENCION",
  RESUELTA = "RESUELTA",
  CANCELADA = "CANCELADA",
  FALSA_ALERTA = "FALSA_ALERTA",
}

// De response/solicitudes-cancelacion.ts
export enum EstadoSolicitudCancelacion {
  PENDIENTE = "PENDIENTE",
  APROBADA = "APROBADA",
  RECHAZADA = "RECHAZADA",
}

// De request/atenciones.ts
export enum RolAtencion {
  ENCARGADO = "ENCARGADO",
  APOYO = "APOYO",
}

// De victimas/Victima.ts
export enum EstadoCuenta {
  ACTIVA = "ACTIVA",
  INACTIVA = "INACTIVA",
  SUSPENDIDA = "SUSPENDIDA",
  PENDIENTE_VERIFICACION = "PENDIENTE_VERIFICACION",
}

// De eventos/Evento.ts
export enum TipoEvento {
  ALERTA_RECIBIDA = "ALERTA_RECIBIDA",
  ALERTA_ASIGNADA = "ALERTA_ASIGNADA",
  CONTACTO_FAMILIARES = "CONTACTO_FAMILIARES",
  ATENCION_VICTIMA = "ATENCION_VICTIMA",
  ALERTA_CERRADA = "ALERTA_CERRADA",
  ALERTA_CANCELADA = "ALERTA_CANCELADA",
  FALSA_ALERTA = "FALSA_ALERTA",
}
