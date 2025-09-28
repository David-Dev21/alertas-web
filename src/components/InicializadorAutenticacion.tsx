'use client';
import { useAutenticacionHydration } from '@/hooks/autenticacion/useAutenticacionHydration';
import { useAuth } from '@/hooks/autenticacion/useAutenticacion';

/**
 * Componente que inicializa el estado de autenticación al cargar la aplicación.
 * Restaura datos del usuario desde localStorage si existen y limpia alertas locales
 * que ya no existan en la base de datos.
 */
export function InicializadorAutenticacion({ children }: { children: React.ReactNode }) {
  // Hidratar auth
  useAutenticacionHydration();

  const { isAuthenticated } = useAuth();

  // Si no está autenticado, no mostrar nada del sistema
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
