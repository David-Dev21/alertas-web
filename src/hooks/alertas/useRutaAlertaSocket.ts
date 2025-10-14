import { useEffect, useState } from "react";
import { alertasSocketService } from "@/services/alertas/alertasSocketService";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

interface UltimoPuntoRuta {
  idAlerta: string;
  coordenadas: [number, number]; // [lat, lng] para Leaflet
  timestamp: number; // Timestamp de cuando se recibió el punto
}

interface DatosRutaSocket {
  idAlerta: string;
  coordenadas: [number, number];
}

export function useRutaAlertaSocket(idAlerta: string) {
  const [ultimoPunto, setUltimoPunto] = useState<UltimoPuntoRuta | null>(null);
  const [escuchandoRuta, setEscuchandoRuta] = useState(false);
  const { datosUsuario, accessToken } = useAutenticacionStore();

  useEffect(() => {
    if (!datosUsuario?.idUsuario || !accessToken || !idAlerta) {
      setEscuchandoRuta(false);
      return;
    }

    const eventoRuta = `rutaAlerta:${idAlerta}`;
    setEscuchandoRuta(true);

    const manejarPuntoRuta = (datos: DatosRutaSocket) => {
      const nuevoPunto: UltimoPuntoRuta = {
        ...datos,
        timestamp: Date.now(),
      };

      setUltimoPunto(nuevoPunto);
    };

    // Suscribirse al evento específico de esta alerta
    alertasSocketService.escucharEvento(eventoRuta, manejarPuntoRuta as (...args: unknown[]) => void);

    return () => {
      // Limpiar suscripción cuando el componente se desmonte o cambie la alerta
      alertasSocketService.dejarDeEscucharEvento(eventoRuta, manejarPuntoRuta as (...args: unknown[]) => void);
      setEscuchandoRuta(false);
    };
  }, [datosUsuario?.idUsuario, accessToken, idAlerta]);

  return {
    ultimoPunto,
    escuchandoRuta,
  };
}
