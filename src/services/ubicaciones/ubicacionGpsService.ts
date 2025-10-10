import api from "../baseApi";
import { Coordenadas } from "@/types/request/ubicaciones";
import { RespuestaDepartamento } from "@/types/response/ubicaciones";

export const ubicacionGpsService = {
  obtenerUbicacionActual: (): Promise<Coordenadas> => {
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
  },

  obtenerDepartamento: async (coordenadas: Coordenadas): Promise<RespuestaDepartamento> => {
    const response = await api.get("/departamentos/encontrar", {
      params: coordenadas,
    });
    return response.data;
  },
};
