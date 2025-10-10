import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

/**
 * Hook para acceder a la información de ubicación del usuario autenticado
 */
export function useUbicacionUsuario() {
  const { datosUsuario } = useAutenticacionStore();

  return {
    idDepartamento: datosUsuario?.ubicacion?.idDepartamento || null,
    departamento: datosUsuario?.ubicacion?.departamento || null,
    tieneUbicacion: !!datosUsuario?.ubicacion,
  };
}
