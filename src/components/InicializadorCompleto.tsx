"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { ubicacionGpsService } from "@/services/ubicaciones/ubicacionGpsService";
import { alertasSocketService } from "@/services/alertas/alertasSocketService";
import { usuariosPanelService } from "@/services/usuarios/usuariosPanelService";
import { useNotificacionesPush } from "@/hooks/notificaciones/useNotificacionesPush";
import { toast } from "sonner";

export function InicializadorCompleto({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, datosUsuario, datosSistema, accessToken, inicializar, setUbicacionUsuario } = useAutenticacionStore();
  const { solicitarPermiso } = useNotificacionesPush();
  const [validando, setValidando] = useState(true);
  const [inicializado, setInicializado] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 1. Inicializar autenticación desde localStorage
  useEffect(() => {
    inicializar();
    setValidando(false);
  }, [inicializar]);

  // 2. Validar autenticación y redirigir si es necesario
  useEffect(() => {
    if (!validando && !estaAutenticado && !accessToken) {
      window.location.href = "https://kerveros-dev.policia.bo";
    }
  }, [validando, estaAutenticado, accessToken, router, pathname]);

  // 3. Inicialización completa (solo si está autenticado)
  useEffect(() => {
    if (inicializado || !estaAutenticado || !datosUsuario?.idUsuario || validando) return;

    async function inicializar() {
      if (!datosUsuario) return;

      try {
        // 3.1 Crear/registrar usuario en el panel del backend (solo si no está registrado persistentemente)
        const usuarioRegistrado = localStorage.getItem("usuarioPanelRegistrado");
        if (usuarioRegistrado !== datosUsuario.idUsuario) {
          try {
            // Función para limpiar y formatear el nombre completo
            const formatearNombreCompleto = (nombreCrudo: string): string => {
              return nombreCrudo
                .trim()
                .split(/\s+/) // Dividir por uno o más espacios
                .filter((parte) => parte.length > 0) // Eliminar partes vacías
                .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()) // Capitalizar cada parte
                .join(" "); // Unir con espacio simple
            };

            const nombreFormateado = formatearNombreCompleto(datosUsuario.nombreCompleto);

            const respuesta = await usuariosPanelService.crearUsuarioPanel({
              id: datosUsuario.idUsuario,
              grado: "Sgto.", // Puedes ajustar esto según tus necesidades
              nombreCompleto: nombreFormateado,
              unidad: datosUsuario.unidad.nombreCompletoOrganismo,
              rol: {
                nombre: datosSistema?.roles[0]?.nombre || "OPERADOR",
                permisos: datosSistema?.permisos || [],
                modulos: datosSistema?.modulos.map((m) => m.nombre) || [],
              },
            });

            if (respuesta.exito) {
              console.log("Usuario registrado en panel del backend");
              // Marcar como registrado persistentemente
              localStorage.setItem("usuarioPanelRegistrado", datosUsuario.idUsuario);
            } else {
              console.error("Error al registrar usuario en panel:", respuesta.mensaje);
              toast.error(respuesta.mensaje || "Error al registrar usuario");
            }
          } catch (error) {
            console.error("Error al registrar usuario en panel", error);
          }
        } else {
          console.log("Usuario ya registrado persistentemente, omitiendo registro");
        }
        let idDepartamento = datosUsuario.ubicacion?.idDepartamento;
        let departamento = datosUsuario.ubicacion?.departamento;
        let latitud = datosUsuario.ubicacion?.latitud;
        let longitud = datosUsuario.ubicacion?.longitud;

        // 3.2 Obtener ubicación si no la tenemos
        if (!datosUsuario.ubicacion) {
          const coordenadas = await ubicacionGpsService.obtenerUbicacionActual();
          const departamentoData = await ubicacionGpsService.obtenerDepartamento(coordenadas);

          const departamentoInfo = departamentoData.datos?.departamento;
          if (departamentoInfo) {
            idDepartamento = departamentoInfo.id;
            departamento = departamentoInfo.departamento;
            latitud = coordenadas.latitud;
            longitud = coordenadas.longitud;

            setUbicacionUsuario(idDepartamento, departamento, latitud, longitud);
            toast.success(`Ubicación obtenida correctamente en ${departamento}`);
          }
        }

        // 3.3 Conectar WebSocket
        if (idDepartamento && typeof idDepartamento === "number") {
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

        // 3.4 Solicitar permisos de notificación
        try {
          await solicitarPermiso();
        } catch (error) {
          console.warn("Error al solicitar permisos de notificación:", error);
        }

        setInicializado(true);
      } catch (error) {
        console.error("Error al inicializar:", error);
        toast.error(error instanceof Error ? error.message : "Error de inicialización");
      }
    }

    inicializar();
  }, [estaAutenticado, datosUsuario?.idUsuario, inicializado, setUbicacionUsuario, solicitarPermiso, validando]);

  // Desconectar cuando se desautentica
  useEffect(() => {
    if (!estaAutenticado && inicializado) {
      alertasSocketService.desconectar();
      localStorage.removeItem("usuarioPanelRegistrado");
      localStorage.removeItem("fcmTokenRegistrado");
      setInicializado(false);
    }
  }, [estaAutenticado, inicializado]);

  // Mostrar loading mientras valida autenticación
  if (validando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar loading mientras redirige
  if (!estaAutenticado || !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
