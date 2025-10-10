"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorEstado } from "@/components/ErrorEstado";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";

export default function InicializaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const { setToken, setDatosUsuario, setDatosSistema } = useAuth();

  useEffect(() => {
    const inicializarAutenticacion = async () => {
      try {
        // Obtener datos codificados desde la URL
        const datosAutenticacionCodificados = searchParams.get("auth");

        if (!datosAutenticacionCodificados || !datosAutenticacionCodificados.length) {
          setMensajeError("No se encontraron datos de autenticación");
          return;
        }

        // Decodificar datos de autenticación
        let respuestaBackend = JSON.parse(atob(datosAutenticacionCodificados));

        // Corregir codificación de caracteres especiales
        respuestaBackend = corregirCodificacionCaracteres(respuestaBackend);

        // Validar estructura de datos (access_token y refresh_token se mantienen en inglés)
        if (!respuestaBackend.access_token || !respuestaBackend.userData || !respuestaBackend.systemData) {
          throw new Error("Datos de autenticación incompletos");
        }

        const datosDelBackend = respuestaBackend.userData;
        const datosDelSistema = respuestaBackend.systemData;

        // Transformar datos del usuario a español
        const datosUsuario = {
          nombre: datosDelBackend.name,
          apellido: datosDelBackend.lastName,
          nombreCompleto: datosDelBackend.fullName,
          correo: datosDelBackend.email,
          imagenUsuario: datosDelBackend.imageUser,
          idUsuario: datosDelBackend.userId,
          nombreUsuario: datosDelBackend.username,
          activo: datosDelBackend.active,
          verificado: datosDelBackend.verified,
          creadoEn: datosDelBackend.createdAt,
          ultimoAcceso: datosDelBackend.lastAccess,
          unidad: {
            idUnidad: datosDelBackend.unidad.unidadId,
            abreviacion: datosDelBackend.unidad.abreviacion,
            idOrganismo: datosDelBackend.unidad.organismoId,
            nombreCompletoOrganismo: datosDelBackend.unidad.organismoFullName,
          },
        };

        // Transformar datos del sistema a español
        const datosSistema = {
          nombre: datosDelSistema.name,
          roles: datosDelSistema.roles.map((rol: any) => ({
            nombre: rol.name,
          })),
          modulos: datosDelSistema.modules.map((modulo: any) => ({
            nombre: modulo.name,
            ruta: modulo.path,
            icono: modulo.icon,
            orden: modulo.order,
            hijos: modulo.children.map((hijo: any) => ({
              icono: hijo.icon,
              nombre: hijo.name,
              orden: hijo.order,
              ruta: hijo.path,
            })),
          })),
          permisos: datosDelSistema.permissions,
        };

        // Guardar refresh_token si existe (el resto lo guarda el store automáticamente)
        if (respuestaBackend.refresh_token) {
          localStorage.setItem("refresh_token", respuestaBackend.refresh_token);
        }

        // Actualizar el store de Zustand (esto automáticamente guarda en localStorage)
        setToken(respuestaBackend.access_token);
        setDatosUsuario(datosUsuario);
        setDatosSistema(datosSistema);

        console.log("Token:", respuestaBackend.access_token);
        console.log("Usuario:", datosUsuario);
        console.log("Sistema:", datosSistema);

        // Redirigir al dashboard
        router.push("/dashboard");
      } catch (error) {
        setMensajeError(error instanceof Error ? error.message : "Error al procesar datos de autenticación");
      }
    };

    inicializarAutenticacion();
  }, [searchParams, router, setToken, setDatosUsuario, setDatosSistema]);

  // Mostrar error si ocurrió algún problema
  if (mensajeError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorEstado mensaje={mensajeError} enlaceVolver="https://kerveros-dev.policia.bo/auth/login" />
      </div>
    );
  }

  // Mostrar pantalla de carga
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto" />
        <p className="text-lg font-medium text-muted-foreground">Procesando autenticación...</p>
      </div>
    </div>
  );
}

/**
 * Corrige problemas de codificación UTF-8 en los datos recibidos
 * Convierte caracteres mal codificados a su forma correcta
 */
function corregirCodificacionCaracteres(objeto: any): any {
  if (typeof objeto === "string") {
    return objeto
      .replace(/Ã©/g, "é")
      .replace(/Ã³/g, "ó")
      .replace(/Ã±/g, "ñ")
      .replace(/Ã¡/g, "á")
      .replace(/Ã­/g, "í")
      .replace(/Ãº/g, "ú")
      .replace(/Ã¼/g, "ü")
      .replace(/Ã‰/g, "É")
      .replace(/Ã"/g, "Ó")
      .replace(/Ã'/g, "Ñ")
      .replace(/Ã/g, "Á")
      .replace(/Ã/g, "Í")
      .replace(/Ãš/g, "Ú");
  }

  if (Array.isArray(objeto)) {
    return objeto.map(corregirCodificacionCaracteres);
  }

  if (objeto && typeof objeto === "object") {
    const objetoCorregido: any = {};
    for (const clave in objeto) {
      objetoCorregido[clave] = corregirCodificacionCaracteres(objeto[clave]);
    }
    return objetoCorregido;
  }

  return objeto;
}
