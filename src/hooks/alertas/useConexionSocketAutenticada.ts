// Hook para manejar la conexión WebSocket con autenticación automática
import { useCallback } from "react";
import { alertasSocketService } from "@/services/alertas/alertasSocketService";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

/**
 * Hook que maneja la conexión WebSocket enviando automáticamente
 * los datos del usuario autenticado como parámetros de conexión
 */
export function useConexionSocketAutenticada() {
  const { datosUsuario, estaAutenticado, accessToken } = useAutenticacionStore();

  const conectarConAutenticacion = useCallback(() => {
    if (estaAutenticado && datosUsuario?.idUsuario) {
      // Obtener idDepartamento de los datos del usuario
      const idDepartamento = datosUsuario.ubicacion?.idDepartamento;
      if (!idDepartamento) {
        console.warn("No se puede conectar al websocket: falta departamento en los datos del usuario");
        return;
      }

      alertasSocketService.conectar({
        idUsuario: datosUsuario.idUsuario,
        tipo: "SUPERVISOR",
        idDepartamento: idDepartamento,
        token: accessToken || "",
      });
    } else {
      console.warn("No se puede conectar: usuario no autenticado");
    }
  }, [estaAutenticado, datosUsuario?.idUsuario, datosUsuario?.ubicacion?.idDepartamento, accessToken]);

  const desconectar = useCallback(() => {
    console.log("Desconectando WebSocket");
    alertasSocketService.desconectar();
  }, []);

  return {
    conectarConAutenticacion,
    desconectar,
    estaAutenticado,
    idUsuario: datosUsuario?.idUsuario,
  };
}
