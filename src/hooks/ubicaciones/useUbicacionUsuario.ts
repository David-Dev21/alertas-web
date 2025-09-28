import { useAutenticacionStore } from '@/stores/autenticacion/autenticacionStore';

/**
 * Hook para acceder a la información de ubicación del usuario autenticado
 */
export function useUbicacionUsuario() {
  const { userData } = useAutenticacionStore();

  return {
    idDepartamento: userData?.ubicacion?.idDepartamento || null,
    departamento: userData?.ubicacion?.departamento || null,
    tieneUbicacion: !!userData?.ubicacion,
  };
}
