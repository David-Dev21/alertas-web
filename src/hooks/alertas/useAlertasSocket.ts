// Hook para suscribirse a eventos del WebSocket de alertas
import { useEffect } from "react";
import { alertasSocketService } from "@/services/alertas/alertasSocketService";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

interface DatosNuevaAlerta {
  idAlerta: string;
  estado: string;
  origen: string;
  fechaHora: string;
  victima: string;
}

interface DatosCancelacionSolicitud {
  idSolicitud: string;
  idAlerta: string;
  estado: string;
  fechaHora: string;
  victima: string;
}

interface OpcionesSuscripcion {
  onNuevaAlerta?: (datos: DatosNuevaAlerta) => void;
  onCancelacionSolicitud?: (datos: DatosCancelacionSolicitud) => void;
}

export function useAlertasSocket(opciones: OpcionesSuscripcion) {
  const { datosUsuario, accessToken } = useAutenticacionStore();

  useEffect(() => {
    // Solo suscribirse a eventos si está autenticado
    if (!datosUsuario?.idUsuario || !accessToken) {
      return;
    }

    // Suscripción a nuevas alertas
    if (opciones.onNuevaAlerta) {
      alertasSocketService.onNuevaAlerta(opciones.onNuevaAlerta);
    }

    // Suscripción a cancelaciones de solicitud
    if (opciones.onCancelacionSolicitud) {
      alertasSocketService.onCancelacionSolicitud(opciones.onCancelacionSolicitud);
    }

    return () => {
      // Limpiar suscripciones
      if (opciones.onNuevaAlerta) {
        alertasSocketService.offNuevaAlerta(opciones.onNuevaAlerta);
      }
      if (opciones.onCancelacionSolicitud) {
        alertasSocketService.offCancelacionSolicitud(opciones.onCancelacionSolicitud);
      }
    };
  }, [datosUsuario?.idUsuario, accessToken, opciones.onNuevaAlerta, opciones.onCancelacionSolicitud]);
}
