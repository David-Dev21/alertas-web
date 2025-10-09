/**
 * Configuración centralizada para los mapas Leaflet
 */

// Configuración de tiles del mapa
export const MAPA_CONFIG = {
  // OpenStreetMap estilo clásico
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },

  // Centro por defecto (La Paz, Bolivia)
  centroDefecto: [-16.5, -68.15] as [number, number],

  // Zoom por defecto
  zoomDefecto: 12,
  zoomDetalle: 15,
  zoomDestacado: 16,

  // Estilos de círculo para alertas destacadas
  circuloDestacado: {
    radio: 50,
    color: "#55632E",
    fillColor: "#55632E",
    fillOpacity: 0.5,
    weight: 4,
  },

  // Centros por departamento de Bolivia
  centrosPorDepartamento: {
    1: [-16.5, -68.15] as [number, number], // La Paz
    2: [-17.78, -63.18] as [number, number], // Santa Cruz
    3: [-17.39, -66.16] as [number, number], // Cochabamba
    4: [-19.04, -65.26] as [number, number], // Potosí
    5: [-21.53, -64.73] as [number, number], // Tarija
    6: [-18.98, -65.69] as [number, number], // Chuquisaca
    7: [-17.96, -67.11] as [number, number], // Oruro
    8: [-14.83, -64.9] as [number, number], // Beni
    9: [-11.03, -68.76] as [number, number], // Pando
  },
} as const;

/**
 * Obtiene el centro del mapa basado en las coordenadas detectadas del usuario
 * @param latitud - Latitud detectada (opcional)
 * @param longitud - Longitud detectada (opcional)
 * @param idDepartamento - ID del departamento (siempre debe existir)
 * @returns Coordenadas [latitud, longitud]
 */
export function obtenerCentroMapa(latitud?: number, longitud?: number, idDepartamento?: number): [number, number] {
  // Prioridad 1: Usar coordenadas GPS detectadas del usuario
  if (latitud !== undefined && longitud !== undefined) {
    return [latitud, longitud];
  }

  // Prioridad 2: Usar centro del departamento (siempre debe existir del backend)
  if (idDepartamento && MAPA_CONFIG.centrosPorDepartamento[idDepartamento as keyof typeof MAPA_CONFIG.centrosPorDepartamento]) {
    return MAPA_CONFIG.centrosPorDepartamento[idDepartamento as keyof typeof MAPA_CONFIG.centrosPorDepartamento];
  }

  // Este caso no debería ocurrir nunca (usuario ya autenticado tiene departamento)
  return MAPA_CONFIG.centroDefecto;
}
