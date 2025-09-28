import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UbicacionOperativo {
  idUsuarioOperativo: string;
  idAlerta: string;
  ubicacion: {
    type: 'Feature';
    geometry: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
      accuracy?: number;
      timestamp?: string;
    };
  };
  timestamp: string;
}

interface UbicacionesOperativosStore {
  // Estado - guardado en localStorage por alerta
  ubicacionesPorAlerta: Record<string, UbicacionOperativo[]>;

  // Acciones
  agregarUbicacion: (ubicacion: UbicacionOperativo) => void;
  obtenerUbicacionesAlerta: (idAlerta: string) => UbicacionOperativo[];
  limpiarUbicacionesAlerta: (idAlerta: string) => void;
  limpiarUbicacionesFuncionario: (idAlerta: string, idUsuarioOperativo: string) => void;
}

export const useUbicacionesOperativosStore = create<UbicacionesOperativosStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ubicacionesPorAlerta: {},

      // Agregar nueva ubicación - SIEMPRE se guarda en localStorage
      agregarUbicacion: (ubicacion: UbicacionOperativo) => {
        set((state) => {
          const ubicacionesExistentes = state.ubicacionesPorAlerta[ubicacion.idAlerta] || [];

          // Evitar duplicados basados en timestamp + operativo
          const existe = ubicacionesExistentes.some(
            (u) => u.idUsuarioOperativo === ubicacion.idUsuarioOperativo && u.timestamp === ubicacion.timestamp,
          );

          if (existe) {
            return state;
          }

          const nuevasUbicaciones = {
            ...state.ubicacionesPorAlerta,
            [ubicacion.idAlerta]: [...ubicacionesExistentes, ubicacion],
          };

          return { ubicacionesPorAlerta: nuevasUbicaciones };
        });
      },

      // Obtener ubicaciones de una alerta específica
      obtenerUbicacionesAlerta: (idAlerta: string) => {
        const state = get();
        const ubicaciones = state.ubicacionesPorAlerta[idAlerta] || [];
        return ubicaciones;
      },

      // Limpiar ubicaciones de una alerta específica
      limpiarUbicacionesAlerta: (idAlerta: string) => {
        set((state) => {
          const nuevasUbicaciones = { ...state.ubicacionesPorAlerta };
          delete nuevasUbicaciones[idAlerta];
          return { ubicacionesPorAlerta: nuevasUbicaciones };
        });
      },

      // Limpiar ubicaciones de un funcionario específico en una alerta
      limpiarUbicacionesFuncionario: (idAlerta: string, idUsuarioOperativo: string) => {
        set((state) => {
          const ubicacionesExistentes = state.ubicacionesPorAlerta[idAlerta] || [];
          const ubicacionesFiltradas = ubicacionesExistentes.filter((ubicacion) => ubicacion.idUsuarioOperativo !== idUsuarioOperativo);

          const nuevasUbicaciones = { ...state.ubicacionesPorAlerta };

          if (ubicacionesFiltradas.length > 0) {
            nuevasUbicaciones[idAlerta] = ubicacionesFiltradas;
          } else {
            delete nuevasUbicaciones[idAlerta];
          }

          console.log(`🏪 Store: Eliminadas ubicaciones del funcionario ${idUsuarioOperativo}. Restantes: ${ubicacionesFiltradas.length}`);
          return { ubicacionesPorAlerta: nuevasUbicaciones };
        });
      },
    }),
    {
      name: 'ubicaciones-operativos-store',
      version: 2, // Incrementado por cambio de formato
    },
  ),
);
