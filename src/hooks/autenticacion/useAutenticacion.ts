import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

/**
 * Hook para acceder a los datos de autenticación
 * Proporciona acceso al estado y acciones del almacenamiento de autenticación
 */
export function useAuth() {
  const almacenamiento = useAutenticacionStore();

  return {
    // Estado
    accessToken: almacenamiento.accessToken,
    datosUsuario: almacenamiento.datosUsuario,
    datosSistema: almacenamiento.datosSistema,
    estaAutenticado: almacenamiento.estaAutenticado,

    // Datos específicos del usuario
    usuario: {
      nombre: almacenamiento.datosUsuario?.nombre || "",
      apellido: almacenamiento.datosUsuario?.apellido || "",
      nombreCompleto:
        almacenamiento.datosUsuario?.nombreCompleto ||
        (almacenamiento.datosUsuario ? `${almacenamiento.datosUsuario.nombre} ${almacenamiento.datosUsuario.apellido}` : ""),
      correo: almacenamiento.datosUsuario?.correo || "",
      imagenUsuario: almacenamiento.datosUsuario?.imagenUsuario || "",
      idUsuario: almacenamiento.datosUsuario?.idUsuario || "",
      nombreUsuario: almacenamiento.datosUsuario?.nombreUsuario || "",
      activo: almacenamiento.datosUsuario?.activo || false,
      verificado: almacenamiento.datosUsuario?.verificado || false,
      unidad: almacenamiento.datosUsuario?.unidad || null,
      nombreUnidad: almacenamiento.datosUsuario?.unidad?.nombreCompletoOrganismo || almacenamiento.datosUsuario?.unidad?.abreviacion || "",
    },

    // Datos del sistema
    sistema: {
      nombre: almacenamiento.datosSistema?.nombre || "",
      roles: almacenamiento.datosSistema?.roles || [],
      modulos: almacenamiento.datosSistema?.modulos || [],
      permisos: almacenamiento.datosSistema?.permisos || [],
    },

    // Acciones
    inicializar: almacenamiento.inicializar,
    setToken: almacenamiento.setToken,
    setDatosUsuario: almacenamiento.setDatosUsuario,
    setDatosSistema: almacenamiento.setDatosSistema,
    setRoles: almacenamiento.setRoles,
    setModulos: almacenamiento.setModulos,
    setPermisos: almacenamiento.setPermisos,
    setUbicacionUsuario: almacenamiento.setUbicacionUsuario,
    cerrarSesion: almacenamiento.cerrarSesion,

    // Helpers
    tieneRol: (rol: string) => almacenamiento.datosSistema?.roles.some((r) => r.nombre === rol) || false,
    tienePermiso: (permiso: string) => almacenamiento.datosSistema?.permisos.includes(permiso) || false,
    tieneModulo: (modulo: string) => almacenamiento.datosSistema?.modulos.some((m) => m.nombre === modulo) || false,
  };
}
