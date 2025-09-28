import { useAutenticacionStore } from '@/stores/autenticacion/autenticacionStore';

/**
 * Hook conveniente para acceder a los datos de autenticación
 * Proporciona acceso fácil al estado y acciones del store de auth
 */
export function useAuth() {
  const store = useAutenticacionStore();

  return {
    // Estado
    token: store.token,
    userData: store.userData,
    systemData: store.systemData,
    isAuthenticated: store.isAuthenticated,
    isHydrated: store.isHydrated,

    // Datos específicos del usuario (con valores por defecto seguros)
    user: {
      name: store.userData?.name || '',
      lastName: store.userData?.lastName || '',
      fullName: store.userData?.fullName || (store.userData ? `${store.userData.name} ${store.userData.lastName}` : ''),
      email: store.userData?.email || '',
      imageUser: store.userData?.imageUser || '',
      userId: store.userData?.userId || '',
      username: store.userData?.username || '',
      active: store.userData?.active || false,
      verified: store.userData?.verified || false,
      unidad: store.userData?.unidad || null,
      unidadName: store.userData?.unidad?.organismoFullName || store.userData?.unidad?.abreviacion || '',
    },

    // Datos del sistema (con valores por defecto seguros)
    system: {
      name: store.systemData?.name || '',
      roles: store.systemData?.roles || [],
      modules: store.systemData?.modules || [],
      permissions: store.systemData?.permissions || [],
    },

    // Acciones
    setToken: store.setToken,
    setUserData: store.setUserData,
    setSystemData: store.setSystemData,
    setRoles: store.setRoles,
    setModules: store.setModules,
    setPermissions: store.setPermissions,
    logout: store.logout,

    // Helpers
    hasRole: (role: string) => store.systemData?.roles.some((r) => r.name === role) || false,
    hasPermission: (permission: string) => store.systemData?.permissions.includes(permission) || false,
    hasModule: (module: string) => store.systemData?.modules.some((m) => m.name === module) || false,
  };
}
