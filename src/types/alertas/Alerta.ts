// Enums que coinciden exactamente con el esquema de Prisma
export enum OrigenAlerta {
  ATT = 'ATT',
  FELCV = 'FELCV',
}

export enum EstadoAlerta {
  PENDIENTE = 'PENDIENTE',
  ASIGNADA = 'ASIGNADA',
  EN_ATENCION = 'EN_ATENCION',
  RESUELTA = 'RESUELTA',
  CANCELADA = 'CANCELADA',
  FALSA_ALERTA = 'FALSA_ALERTA',
}

export enum MotivoCierre {
  RESUELTA = 'RESUELTA',
  CANCELADA = 'CANCELADA',
  FALSA_ALERTA = 'FALSA_ALERTA',
}

export enum EstadoSolicitudCancelacion {
  PENDIENTE = 'PENDIENTE',
  APROBADA = 'APROBADA',
  RECHAZADA = 'RECHAZADA',
}

export enum TipoEvidencia {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  FOTO = 'FOTO',
  DOCUMENTO = 'DOCUMENTO',
}

// Interfaces que reflejan el esquema de base de datos

export interface UbicacionPoint {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    accuracy?: number;
    timestamp?: string;
  };
}

export interface ContactoEmergencia {
  parentesco: string;
  nombreCompleto: string;
  celular: string;
  principal: boolean;
}

export interface Victima {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  celular: string;
  correo?: string;
  telefonoValidado?: boolean;
  fechaRegistro?: string;
  idMunicipio: number;
  direccion?: {
    zona: string;
    calle: string;
    numero: string;
    referencia?: string;
  };
  contactosEmergencia?: ContactoEmergencia[];
}

export interface Evidencia {
  id: string;
  idEvento: string;
  tipoEvidencia: TipoEvidencia;
  urlArchivo: string;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

export interface Evento {
  id: string;
  tipoEvento: string;
  fechaHora: string;
  ubicacion?: UbicacionPoint | null;
  funcionarioExterno?: string | null;
}

export interface RutaAlerta {
  id: string;
  idAlerta: string;
  ruta: any; // Geography LineString
  precisionGps?: number;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

export interface Alerta {
  id: string;
  idVictima: string;
  idMunicipio?: number;
  fechaHora: string;
  codigoCud?: string;
  codigoRegistro?: string;
  estadoAlerta: EstadoAlerta;
  ubicacion?: UbicacionPoint;
  origen: OrigenAlerta;
  municipio?: string;
  provincia?: string;
  departamento?: string;

  // Relaciones
  victima?: Victima;
  atencion?: Atencion;
  eventos?: Evento[];
  cierre?: CierreAlerta;
  rutaAlerta?: RutaAlerta;
  solicitudesCancelacion?: SolicitudCancelacion[];
}

export interface AtencionFuncionario {
  id: string;
  idAtencion: string;
  idFuncionario: string;
  ubicacion: UbicacionPoint;
  turnoServicio: string;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
  rutaFuncionario?: RutaFuncionario;
}

export interface RutaFuncionario {
  id: string;
  idAtencionFuncionario: string;
  ruta: any; // Geography LineString
  precisionGps?: number;
  realizado?: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

export interface Atencion {
  id: string;
  idAlerta: string;
  idUsuario: string;
  siglaVehiculo?: string;
  siglaRadio?: string;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
  atencionFuncionario?: AtencionFuncionario[];
}

export interface CierreAlerta {
  usuarioAdmin: string;
  fechaHora: string;
  estadoVictima: string;
  idAgresor?: string | null;
  motivoCierre: string;
  observaciones: string;
}

export interface SolicitudCancelacion {
  id: string;
  idAlerta: string;
  motivoCancelacion?: string;
  fechaSolicitud: string;
  estadoSolicitud: EstadoSolicitudCancelacion;
  idUsuario?: string;
  creadoEn: string;
  actualizadoEn: string;
}

// Tipos para WebSocket y datos en tiempo real
export interface AlertaWebSocket {
  id: string;
  idVictima: string;
  fechaHora: string;
  estadoAlerta: EstadoAlerta;
  ubicacion?: UbicacionPoint;
  origen: OrigenAlerta;
  victima?: {
    id: string;
    nombres: string;
    apellidos: string;
    celular: string;
    ci: string;
  };
}

// Tipo simplificado para nuevas alertas desde WebSocket
export interface NuevaAlertaSimple {
  idAlerta: string;
  estado: string; // "PENDIENTE", "EN_ATENCION", etc.
  origen: string; // "FELCV", "APP", etc.
  fechaHora: string; // ISO string
}

// Tipos para formularios y operaciones CRUD
export interface CrearAlerta {
  idVictima: string;
  idMunicipio?: number;
  fechaHora: string;
  codigoCud?: string;
  codigoRegistro?: string;
  estadoAlerta: EstadoAlerta;
  ubicacion?: UbicacionPoint;
  origen: OrigenAlerta;
  datosExternos?: any;
}

export interface ActualizarAlerta {
  estadoAlerta?: EstadoAlerta;
  ubicacion?: UbicacionPoint;
  datosExternos?: any;
  observaciones?: string;
}

export interface CrearEvento {
  idAlerta: string;
  idFuncionario: string;
  observaciones?: string;
  ubicacion?: UbicacionPoint;
  fechaHora: string;
}

// Funciones auxiliares
export function calcularTiempoTranscurrido(fechaHora: string): string {
  const now = new Date();
  const fecha = new Date(fechaHora);
  const diffMs = now.getTime() - fecha.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
}

export function formatearFechaUTC(fechaUTC: string): string {
  try {
    // Normalizar string UTC si es necesario
    let fechaNormalizada = fechaUTC;

    // Si no tiene timezone, añadir Z
    if (!fechaUTC.includes('Z') && !fechaUTC.includes('+') && !fechaUTC.includes('-')) {
      fechaNormalizada = fechaUTC + 'Z';
    }

    // Crear fecha desde string UTC normalizado
    const fecha = new Date(fechaNormalizada);

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha inválida');
    }

    return fecha.toLocaleString('es-BO', {
      timeZone: 'America/La_Paz',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    console.error('Error al formatear fecha UTC:', error, 'Input:', fechaUTC);
    return 'Fecha no disponible';
  }
}

export function obtenerTextoEstado(estado: string | EstadoAlerta): string {
  const estadoNormalizado = typeof estado === 'string' ? estado : String(estado);

  const textos = {
    PENDIENTE: 'Pendiente',
    ASIGNADA: 'Asignada',
    EN_ATENCION: 'En Atención',
    RESUELTA: 'Resuelta',
    CANCELADA: 'Cancelada',
    FALSA_ALERTA: 'Falsa Alerta',
  } as const;

  return textos[estadoNormalizado as keyof typeof textos] || estadoNormalizado;
}
