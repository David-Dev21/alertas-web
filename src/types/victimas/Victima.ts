// Interfaces para el módulo de víctimas

export interface Direccion {
  zona: string;
  calle: string;
  numero: string;
  referencia: string;
}

export interface ContactoEmergencia {
  id?: string;
  parentesco: string;
  nombreCompleto: string;
  celular: string;
}

export interface Victima {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto?: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string | null;
  celular: string;
  correo: string;
  telefonoValidado: boolean;
  idMunicipio?: number;
  direccion?: Direccion;
  fechaRegistro: string;
  contactosEmergencia?: ContactoEmergencia[];
}

export interface CrearVictima {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string;
  correo: string;
  telefonoValidado: boolean;
  idMunicipio: number;
  direccion: Direccion;
  contactosEmergencia: ContactoEmergencia[];
}

export interface ActualizarVictima {
  cedulaIdentidad?: string;
  nombres?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  celular?: string;
  correo?: string;
  telefonoValidado?: boolean;
  idMunicipio?: number;
  direccion?: Direccion;
  contactosEmergencia?: ContactoEmergencia[];
}

export interface PaginacionVictimas {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface RespuestaVictimas {
  victimas: Victima[];
  paginacion: PaginacionVictimas;
}

export interface ParametrosConsultaVictimas {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  cedulaIdentidad?: string;
  nombreCompleto?: string;
  telefonoValidado?: boolean;
}
