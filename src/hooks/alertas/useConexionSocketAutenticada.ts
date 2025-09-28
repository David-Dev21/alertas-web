// Hook para manejar la conexión WebSocket con autenticación automática
import { useCallback } from 'react';
import { alertasSocketService } from '@/services/alertas/alertasSocketService';
import { useAutenticacionStore } from '@/stores/autenticacion/autenticacionStore';

/**
 * Hook que maneja la conexión WebSocket enviando automáticamente
 * los datos del usuario autenticado como parámetros de conexión
 */
export function useConexionSocketAutenticada() {
  const { userData, isAuthenticated } = useAutenticacionStore();

  const conectarConAutenticacion = useCallback(() => {
    if (isAuthenticated && userData?.userId) {
      // Obtener idDepartamento de los datos del usuario
      const idDepartamento = userData.ubicacion?.idDepartamento;
      if (!idDepartamento) {
        console.warn('No se puede conectar al websocket: falta departamento en los datos del usuario');
        return;
      }

      alertasSocketService.conectar({
        idUsuario: userData.userId,
        tipo: 'SUPERVISOR',
        idDepartamento: idDepartamento,
      });
    } else {
      console.warn('No se puede conectar: usuario no autenticado');
    }
  }, [isAuthenticated, userData?.userId, userData?.ubicacion?.idDepartamento]);

  const desconectar = useCallback(() => {
    console.log('Desconectando WebSocket');
    alertasSocketService.desconectar();
  }, []);

  return {
    conectarConAutenticacion,
    desconectar,
    estaAutenticado: isAuthenticated,
    idUsuario: userData?.userId,
  };
}
