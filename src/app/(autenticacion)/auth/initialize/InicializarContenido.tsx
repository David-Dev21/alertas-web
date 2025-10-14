"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorEstado } from "@/components/ErrorEstado";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";
import { usuariosPanelService } from "@/services/usuarios/usuariosPanelService";
import { ubicacionesService } from "@/services/ubicaciones/departamentosService";
import { useUbicacionDispositivo } from "@/hooks/ubicaciones/useUbicacionDispositivo";
import { formatearNombreCompleto } from "@/lib/utils";

export function InicializarContenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const { setToken, setDatosUsuario, setDatosSistema, setUbicacionUsuario } = useAuth();
  const { obtenerUbicacionActual } = useUbicacionDispositivo();

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
          roles: datosDelSistema.roles.map((rol: { name: string }) => ({
            nombre: rol.name,
          })),
          modulos: datosDelSistema.modules.map((modulo: { name: string; path: string; icon: string; order: number; children: unknown[] }) => ({
            nombre: modulo.name,
            ruta: modulo.path,
            icono: modulo.icon,
            orden: modulo.order,
            hijos: (modulo.children as Array<{ icon: string; name: string; order: number; path: string }>).map((hijo) => ({
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

        // Obtener ubicación para el registro
        const coordenadas = await obtenerUbicacionActual();
        const departamentoData = await ubicacionesService.obtenerDepartamentoPorCoordenadas(coordenadas);
        if (!departamentoData.departamento?.id) {
          throw new Error("No se pudo determinar el departamento para el registro");
        }
        const idDepartamento = departamentoData.departamento.id;

        // Guardar ubicación en el store
        setUbicacionUsuario(idDepartamento, departamentoData.departamento.departamento, coordenadas.latitud, coordenadas.longitud);

        // Crear usuario panel cada vez que se inicializa
        try {
          const nombreFormateado = formatearNombreCompleto(datosUsuario.nombreCompleto);
          await usuariosPanelService.crearUsuarioPanel({
            id: datosUsuario.idUsuario,
            grado: "Sgto.",
            nombreCompleto: nombreFormateado,
            unidad: datosUsuario.unidad.nombreCompletoOrganismo,
            idDepartamento,
            autorizacion: {
              rol: datosSistema.roles[0]?.nombre || "OPERADOR",
              permisos: datosSistema.permisos || [],
              modulos:
                datosSistema.modulos?.map((m: { nombre: string; ruta: string; icono: string; orden: number }) => ({
                  nombre: m.nombre,
                  ruta: m.ruta,
                  icono: m.icono,
                  orden: m.orden,
                })) || [],
            },
          });
        } catch (error) {
          console.error("Error al crear usuario panel:", error);
          // No bloquear la inicialización por este error
        }

        console.log("Token:", respuestaBackend.access_token);
        console.log("Usuario:", datosUsuario);
        console.log("Sistema:", datosSistema);

        // Redirigir al dashboard
        router.push("/alertas-activas");
      } catch (error) {
        setMensajeError(error instanceof Error ? error.message : "Error al procesar datos de autenticación");
      }
    };

    inicializarAutenticacion();
  }, [searchParams, router, setToken, setDatosUsuario, setDatosSistema, obtenerUbicacionActual, setUbicacionUsuario]);

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
function corregirCodificacionCaracteres(objeto: unknown): unknown {
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
    const objetoCorregido: Record<string, unknown> = {};
    for (const clave in objeto) {
      objetoCorregido[clave] = corregirCodificacionCaracteres((objeto as Record<string, unknown>)[clave]);
    }
    return objetoCorregido;
  }

  return objeto;
}
