import { useState, useEffect, useCallback } from "react";
import { solicitarPermisoNotificaciones, escucharMensajesPrimerPlano } from "@/lib/firebase";
import { usuariosPanelService } from "@/services/usuarios/usuariosPanelService";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { toast } from "sonner";

interface UseNotificacionesPushReturn {
  tokenFCM: string | null;
  permisoConcedido: boolean;
  solicitarPermiso: () => Promise<void>;
  cargando: boolean;
}

/**
 * Hook para manejar notificaciones push de Firebase
 */
export const useNotificacionesPush = (): UseNotificacionesPushReturn => {
  const { datosUsuario } = useAutenticacionStore();
  const [tokenFCM, setTokenFCM] = useState<string | null>(null);
  const [permisoConcedido, setPermisoConcedido] = useState(false);
  const [cargando, setCargando] = useState(false);

  const solicitarPermiso = useCallback(async () => {
    setCargando(true);
    try {
      const token = await solicitarPermisoNotificaciones();

      if (token) {
        setTokenFCM(token);
        setPermisoConcedido(true);

        // Enviar el token al backend (solo si no está registrado persistentemente)
        const tokenRegistrado = localStorage.getItem("fcmTokenRegistrado");
        if (tokenRegistrado !== token) {
          try {
            const infoDispositivo = {
              navegador: navigator.userAgent.includes("Chrome")
                ? "Chrome"
                : navigator.userAgent.includes("Firefox")
                ? "Firefox"
                : navigator.userAgent.includes("Safari")
                ? "Safari"
                : "Otro",
              sistemaOperativo: navigator.platform,
              dispositivo: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "Móvil" : "Escritorio",
            };

            if (datosUsuario?.idUsuario) {
              await usuariosPanelService.registrarTokenFCM(datosUsuario.idUsuario, {
                fcmToken: token,
                infoDispositivo,
              });

              // Marcar como registrado persistentemente
              localStorage.setItem("fcmTokenRegistrado", token);
              toast.success("Notificaciones activadas correctamente");
            } else {
              console.warn("No se pudo obtener el ID del usuario para registrar el token FCM");
              toast.warning("Notificaciones activadas localmente, pero no se pudo sincronizar con el servidor");
            }
          } catch (error) {
            console.error("Error al registrar token en el backend:", error);
            toast.warning("Notificaciones activadas localmente, pero no se pudo sincronizar con el servidor");
          }
        } else {
          console.log("Token FCM ya registrado persistentemente, omitiendo registro");
        }
      } else {
        setPermisoConcedido(false);

        // Mensaje específico para Brave
        if ((navigator as any).brave) {
          toast.error("Notificaciones bloqueadas por Brave", {
            description: "Ve a brave://settings/privacy y activa 'Google Services for push messaging'",
            duration: 10000,
          });
        } else {
          toast.error("No se pudo obtener permiso para notificaciones");
        }
      }
    } catch (error) {
      console.error("Error al solicitar permiso:", error);

      // Mensaje específico para Brave
      if ((navigator as any).brave && error instanceof Error && error.message.includes("push service error")) {
        toast.error("Notificaciones bloqueadas por Brave", {
          description: "Activa 'Google Services for push messaging' en la configuración de privacidad",
          duration: 10000,
        });
      } else {
        toast.error("Error al activar notificaciones");
      }
    } finally {
      setCargando(false);
    }
  }, [datosUsuario?.idUsuario]);

  useEffect(() => {
    // Solo verificar el estado del permiso, NO solicitar automáticamente
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setPermisoConcedido(true);
      }
    }
  }, []);

  useEffect(() => {
    // Escuchar mensajes en primer plano
    const unsubscribe = escucharMensajesPrimerPlano((payload) => {
      const titulo = payload.notification?.title || "Nueva notificación";
      const cuerpo = payload.notification?.body || "";

      toast.info(titulo, {
        description: cuerpo,
        duration: 5000,
      });
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return {
    tokenFCM,
    permisoConcedido,
    solicitarPermiso,
    cargando,
  };
};
