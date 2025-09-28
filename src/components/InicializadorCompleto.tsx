'use client';

import { useEffect, useState } from 'react';
import { useAutenticacionStore } from '@/stores/autenticacion/autenticacionStore';
import { obtenerUbicacionActual, obtenerDepartamento } from '@/services/ubicaciones/ubicacionGpsService';
import { alertasSocketService } from '@/services/alertas/alertasSocketService';
import { toast } from 'sonner';

export function InicializadorCompleto() {
  const { isAuthenticated, userData, setUbicacionUsuario } = useAutenticacionStore();
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    if (inicializado || !isAuthenticated || !userData?.userId) return;

    async function inicializar() {
      if (!userData) return;

      try {
        let idDepartamento = userData.ubicacion?.idDepartamento;
        let departamento = userData.ubicacion?.departamento;

        // 1. Obtener ubicación si no la tenemos
        if (!userData.ubicacion) {
          const coordenadas = await obtenerUbicacionActual();
          const departamentoData = await obtenerDepartamento(coordenadas);

          idDepartamento = departamentoData.departamento.id;
          departamento = departamentoData.departamento.departamento;

          setUbicacionUsuario(idDepartamento, departamento);
          toast.success(`Ubicación obtenida correctamente en ${departamento}`);
        }

        // 2. Conectar WebSocket
        if (idDepartamento) {
          alertasSocketService.conectar({
            idUsuario: userData.userId,
            tipo: 'SUPERVISOR',
            idDepartamento: idDepartamento,
          });

          const manejarConexion = (conectado: boolean) => {
            if (conectado) {
              toast.success(`Conectado al sistema de alertas para ${departamento}`);
            } else {
              toast.error('Perdida de conexión con el sistema de alertas');
            }
          };

          alertasSocketService.onConexionCambiada(manejarConexion);
        }

        setInicializado(true);
      } catch (error) {
        console.error('Error al inicializar:', error);
        toast.error(error instanceof Error ? error.message : 'Error de inicialización');
      }
    }

    inicializar();
  }, [isAuthenticated, userData?.userId, inicializado, setUbicacionUsuario]); // Solo dependencias estables

  // Desconectar cuando se desautentica
  useEffect(() => {
    if (!isAuthenticated && inicializado) {
      alertasSocketService.desconectar();
      setInicializado(false);
    }
  }, [isAuthenticated, inicializado]);

  return null;
}
