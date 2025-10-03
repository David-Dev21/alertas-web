"use client";

import { useEffect, useState } from "react";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { obtenerUbicacionActual, obtenerDepartamento } from "@/services/ubicaciones/ubicacionGpsService";
import { alertasSocketService } from "@/services/alertas/alertasSocketService";
import { toast } from "sonner";

export function InicializadorCompleto() {
  const { estaAutenticado, datosUsuario, establecerUbicacionUsuario } = useAutenticacionStore();
  const [inicializado, setInicializado] = useState(false);

  useEffect(() => {
    if (inicializado || !estaAutenticado || !datosUsuario?.idUsuario) return;

    async function inicializar() {
      if (!datosUsuario) return;

      try {
        let idDepartamento = datosUsuario.ubicacion?.idDepartamento;
        let departamento = datosUsuario.ubicacion?.departamento;

        // 1. Obtener ubicación si no la tenemos
        if (!datosUsuario.ubicacion) {
          const coordenadas = await obtenerUbicacionActual();
          const departamentoData = await obtenerDepartamento(coordenadas);

          idDepartamento = departamentoData.departamento.id;
          departamento = departamentoData.departamento.departamento;

          establecerUbicacionUsuario(idDepartamento, departamento);
          toast.success(`Ubicación obtenida correctamente en ${departamento}`);
        }

        // 2. Conectar WebSocket
        if (idDepartamento) {
          alertasSocketService.conectar({
            idUsuario: datosUsuario.idUsuario,
            tipo: "SUPERVISOR",
            idDepartamento: idDepartamento,
          });

          const manejarConexion = (conectado: boolean) => {
            if (conectado) {
              toast.success(`Conectado al sistema de alertas para ${departamento}`);
            } else {
              toast.error("Perdida de conexión con el sistema de alertas");
            }
          };

          alertasSocketService.onConexionCambiada(manejarConexion);
        }

        setInicializado(true);
      } catch (error) {
        console.error("Error al inicializar:", error);
        toast.error(error instanceof Error ? error.message : "Error de inicialización");
      }
    }

    inicializar();
  }, [estaAutenticado, datosUsuario?.idUsuario, inicializado, establecerUbicacionUsuario]);

  // Desconectar cuando se desautentica
  useEffect(() => {
    if (!estaAutenticado && inicializado) {
      alertasSocketService.desconectar();
      setInicializado(false);
    }
  }, [estaAutenticado, inicializado]);

  return null;
}
