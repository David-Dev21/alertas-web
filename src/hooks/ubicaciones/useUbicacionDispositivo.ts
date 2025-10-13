import { useState, useCallback } from "react";
import { Coordenadas } from "@/types/request/ubicaciones";

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

  const solicitarPermiso = useCallback(async (): Promise<void> => {
    try {
      await obtenerUbicacionActual();
      setPermiso("granted");
    } catch (error) {
      setPermiso("denied");
      throw error;
    }
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
        (error) => {
          reject(new Error("Error al obtener ubicación"));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  return { obtenerUbicacionActual, solicitarPermiso, verificarPermiso, permiso };
}
