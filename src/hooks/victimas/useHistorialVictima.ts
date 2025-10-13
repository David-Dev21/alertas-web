import { useEffect, useState } from "react";
import { victimasService } from "@/services/victimas/victimasService";
import { HistorialAlertasVictima } from "@/types/response/victimas";

export function useHistorialVictima(idVictima: string) {
  const [historial, setHistorial] = useState<HistorialAlertasVictima | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      setError(null);
      const respuesta = await victimasService.obtenerHistorialAlertas(idVictima);
      if (respuesta.exito && respuesta.datos) {
        setHistorial(respuesta.datos);
      } else {
        setError(respuesta.mensaje || "Error al obtener el historial");
      }
    } catch (err) {
      setError("Error al cargar el historial de alertas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reintentar = () => {
    cargarHistorial();
  };

  useEffect(() => {
    if (idVictima) {
      cargarHistorial();
    }
  }, [idVictima]);

  return {
    historial,
    loading,
    error,
    reintentar,
  };
}
