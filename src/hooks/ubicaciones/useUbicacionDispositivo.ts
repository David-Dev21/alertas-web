import { useState, useCallback } from "react";

// Interfaces duplicadas de types para refactorización

// De request/ubicaciones.ts
interface Coordenadas {
  latitud: number;
  longitud: number;
}

export function useUbicacionDispositivo() {
  const [permiso, setPermiso] = useState<"granted" | "denied" | "prompt" | null>(null);

  const verificarPermiso = useCallback(async (): Promise<"granted" | "denied" | "prompt" | null> => {
    if ("permissions" in navigator) {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermiso(result.state);
      return result.state;
    }
    return null;
  }, []);

  const obtenerUbicacionActual = useCallback((): Promise<Coordenadas> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalización no disponible"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
          });
        },
        (_error) => {
          void _error; // Parámetro requerido por la API pero no usado
          reject(new Error("Error al obtener ubicación"));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  const solicitarPermiso = useCallback(async (): Promise<void> => {
    try {
      await obtenerUbicacionActual();
      setPermiso("granted");
    } catch (error) {
      setPermiso("denied");
      throw error;
    }
  }, [obtenerUbicacionActual]);

  return { obtenerUbicacionActual, solicitarPermiso, verificarPermiso, permiso };
}
