// Tipos para funcionarios y personal policial

export enum TipoFuncionario {
  POLICIA = 'POLICIA',
  SUPERVISOR = 'SUPERVISOR',
  COMANDANTE = 'COMANDANTE',
  OPERADOR = 'OPERADOR',
}

export enum EstadoFuncionario {
  DISPONIBLE = 'DISPONIBLE',
  EN_SERVICIO = 'EN_SERVICIO',
  NO_DISPONIBLE = 'NO_DISPONIBLE',
  DESCANSO = 'DESCANSO',
}

export enum RangoPolicial {
  AGENTE = 'AGENTE',
  CABO = 'CABO',
  SARGENTO = 'SARGENTO',
  SUBTENIENTE = 'SUBTENIENTE',
  TENIENTE = 'TENIENTE',
  CAPITAN = 'CAPITAN',
  MAYOR = 'MAYOR',
  TENIENTE_CORONEL = 'TENIENTE_CORONEL',
  CORONEL = 'CORONEL',
}

export interface Funcionario {
  id: string;
  ci: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  correo?: string;
  celular?: string;
  tipo: TipoFuncionario;
  estado: EstadoFuncionario;
  rango?: RangoPolicial;
  unidad?: string;
  turno?: string;
  fechaIngreso?: string;
  ubicacionActual?: {
    latitud: number;
    longitud: number;
    actualizadoEn: string;
  };
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

export interface AsignacionPersonal {
  id: string;
  idAlerta: string;
  idFuncionario: string;
  fechaAsignacion: string;
  estado: EstadoAsignacion;
  observaciones?: string;
  funcionario: Funcionario;
}

export enum EstadoAsignacion {
  ASIGNADO = 'ASIGNADO',
  EN_CAMINO = 'EN_CAMINO',
  EN_LUGAR = 'EN_LUGAR',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

// Tipos para formularios
export interface CrearAsignacion {
  idAlerta: string;
  idFuncionario: string;
  observaciones?: string;
}

export interface ActualizarAsignacion {
  estado?: EstadoAsignacion;
  observaciones?: string;
}

// Tipos para ubicación en tiempo real desde el backend WebSocket
export interface UbicacionTiempoReal {
  alertaId: string;
  usuario: {
    id: string;
    nombre: string;
  };
  ubicacion: {
    latitud: number;
    longitud: number;
    timestamp: string;
  };
  unidad: {
    abreviacion: string;
    organismoFullName: string;
  };
}

// Tipo para funcionario con ubicación en tiempo real (para el mapa)
export interface FuncionarioUbicacion {
  idFuncionario: string;
  nombreCompleto: string;
  unidad: {
    abreviacion: string;
    organismoFullName: string;
  };
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  timestamp: string;
  alertaId: string; // Para saber a qué alerta está respondiendo
  disponible: boolean;
}

/**
 * Función para convertir UbicacionTiempoReal a FuncionarioUbicacion
 */
export function convertirUbicacionAFuncionario(ubicacion: UbicacionTiempoReal): FuncionarioUbicacion {
  return {
    idFuncionario: ubicacion.usuario.id,
    nombreCompleto: ubicacion.usuario.nombre,
    unidad: ubicacion.unidad,
    ubicacion: {
      latitud: ubicacion.ubicacion.latitud,
      longitud: ubicacion.ubicacion.longitud,
    },
    timestamp: ubicacion.ubicacion.timestamp,
    alertaId: ubicacion.alertaId,
    disponible: true, // En servicio activo
  };
}
