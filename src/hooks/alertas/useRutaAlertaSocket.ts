import { useEffect, useState } from 'react';
import { alertasSocketService } from '@/services/alertas/alertasSocketService';
import { useConexionSocketAutenticada } from './useConexionSocketAutenticada';

interface UltimoPuntoRuta {
  idAlerta: string;
  coordenadas: [number, number]; // [lat, lng] para Leaflet
  timestamp: number; // Timestamp de cuando se recibió el punto
}

export function useRutaAlertaSocket(idAlerta: string) {
  const [ultimoPunto, setUltimoPunto] = useState<UltimoPuntoRuta | null>(null);
  const [escuchandoRuta, setEscuchandoRuta] = useState(false);
  const { estaAutenticado } = useConexionSocketAutenticada();

  useEffect(() => {
    if (!estaAutenticado || !idAlerta) {
      setEscuchandoRuta(false);
      return;
    }

    const eventoRuta = `rutaAlerta:${idAlerta}`;
    setEscuchandoRuta(true);

    const manejarPuntoRuta = (datos: { idAlerta: string; coordenadas: [number, number] }) => {
      const nuevoPunto: UltimoPuntoRuta = {
        ...datos,
        timestamp: Date.now(),
      };

      setUltimoPunto(nuevoPunto);
    };

    // Suscribirse al evento específico de esta alerta
    alertasSocketService.escucharEvento(eventoRuta, manejarPuntoRuta);

    return () => {
      // Limpiar suscripción cuando el componente se desmonte o cambie la alerta
      alertasSocketService.dejarDeEscucharEvento(eventoRuta, manejarPuntoRuta);
      setEscuchandoRuta(false);
    };
  }, [estaAutenticado, idAlerta]);

  return {
    ultimoPunto,
    escuchandoRuta,
  };
}
