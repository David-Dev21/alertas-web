import { useEffect, useRef, useCallback } from "react";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { alertasSocketService } from "@/services/alertas/alertasSocketService";
import { useNotificacionesPush } from "@/hooks/notificaciones/useNotificacionesPush";
import { toast } from "sonner";

export function useInicializacionPrincipal() {
  const { datosUsuario, accessToken } = useAutenticacionStore();
  const { solicitarPermiso, permisoConcedido } = useNotificacionesPush();
  const inicializadoRef = useRef(false);

  const inicializar = useCallback(async () => {
    if (!datosUsuario) return;

    try {
      // Obtener datos de ubicación
      const { idDepartamento, departamento } = datosUsuario.ubicacion || {};

      // Conectar WebSocket
      if (idDepartamento && typeof idDepartamento === "number" && accessToken) {
        alertasSocketService.conectar({
          idUsuario: datosUsuario.idUsuario,
          tipo: "SUPERVISOR",
          idDepartamento,
          token: accessToken,
        });

        alertasSocketService.onConexionCambiada((conectado) => {
          toast[conectado ? "success" : "error"](
            conectado ? `Conectado al sistema de alertas para ${departamento}` : "Perdida de conexión con el sistema de alertas"
          );
        });
      }

      // Solicitar permisos de notificación solo si no están concedidos
      if (!permisoConcedido) {
        await solicitarPermiso();
      }
    } catch (error) {
      console.error("Error al inicializar:", error);
      toast.error(error instanceof Error ? error.message : "Error de inicialización");
    }
  }, [datosUsuario, accessToken, permisoConcedido, solicitarPermiso]);

  useEffect(() => {
    if (!datosUsuario?.idUsuario || !accessToken || inicializadoRef.current) return;
    inicializadoRef.current = true;
    inicializar();
  }, [datosUsuario?.idUsuario, accessToken, inicializar]);

  // Limpiar cuando se desautentica
  useEffect(() => {
    if (!datosUsuario?.idUsuario || !accessToken) {
      alertasSocketService.desconectar();
      localStorage.removeItem("fcmTokenRegistrado");
      inicializadoRef.current = false;
    }
  }, [datosUsuario?.idUsuario, accessToken]);
}
