import { useEffect } from "react";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

/**
 * Hook que hidrata el almacenamiento de Zustand con los datos de localStorage
 * cuando la aplicación arranca.
 *
 * Este hook:
 * 1. Lee access_token, datosUsuario y datosSistema desde localStorage
 * 2. Hidrata el almacenamiento de Zustand con esos valores
 * 3. Si no encuentra valores, no hace nada
 * 4. Se ejecuta solo una vez cuando el componente se monta
 */
export function useAutenticacionHydration() {
  const { establecerToken, establecerDatosUsuario, establecerDatosSistema, estaHidratado, establecerHidratado } = useAutenticacionStore();

  useEffect(() => {
    // Solo ejecutar si no ha sido hidratado aún
    if (estaHidratado) return;

    try {
      // Leer access_token desde localStorage
      const token = localStorage.getItem("access_token");
      if (token) {
        establecerToken(token);
      }

      // Leer datosUsuario desde localStorage
      const datosUsuarioStr = localStorage.getItem("datosUsuario");
      if (datosUsuarioStr) {
        try {
          const datosUsuario = JSON.parse(datosUsuarioStr);
          establecerDatosUsuario(datosUsuario);
        } catch (error) {
          console.warn("Error al parsear datosUsuario desde localStorage:", error);
        }
      }

      // Leer datosSistema desde localStorage
      const datosSistemaStr = localStorage.getItem("datosSistema");
      if (datosSistemaStr) {
        try {
          const datosSistema = JSON.parse(datosSistemaStr);
          establecerDatosSistema(datosSistema);
        } catch (error) {
          console.warn("Error al parsear datosSistema desde localStorage:", error);
        }
      }

      // Marcar como hidratado
      establecerHidratado();
    } catch (error) {
      console.error("Error durante la hidratación de autenticación:", error);
      // Marcar como hidratado incluso si hay error para evitar loops
      establecerHidratado();
    }
  }, [establecerToken, establecerDatosUsuario, establecerDatosSistema, estaHidratado, establecerHidratado]);

  return { estaHidratado };
}
