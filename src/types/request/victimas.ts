// Tipos de solicitud para el módulo de víctimas

export interface ParametrosConsultaVictimas {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  cedulaIdentidad?: string;
  nombreCompleto?: string;
  telefonoValidado?: boolean;
}
