import { useEffect } from 'react';
import { useAutenticacionStore } from '@/stores/autenticacion/autenticacionStore';

/**
 * Hook que hidrata el store de Zustand con los datos de localStorage
 * cuando la aplicación arranca.
 *
 * Este hook:
 * 1. Lee authToken, userData y systemData desde localStorage
 * 2. Hidrata el store de Zustand con esos valores
 * 3. Si no encuentra valores, no hace nada
 * 4. Se ejecuta solo una vez cuando el componente se monta
 */
export function useAutenticacionHydration() {
  const { setToken, setUserData, setSystemData, isHydrated, setHydrated } = useAutenticacionStore();

  useEffect(() => {
    // Solo ejecutar si no ha sido hidratado aún
    if (isHydrated) return;

    try {
      // Leer authToken desde localStorage
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        setToken(authToken);
      }

      // Leer userData desde localStorage
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setUserData(userData);
        } catch (error) {
          console.warn('Error parsing userData from localStorage:', error);
        }
      }

      // Leer systemData desde localStorage
      const systemDataStr = localStorage.getItem('systemData');
      if (systemDataStr) {
        try {
          const systemData = JSON.parse(systemDataStr);
          setSystemData(systemData);
        } catch (error) {
          console.warn('Error parsing systemData from localStorage:', error);
        }
      }

      // Marcar como hidratado
      setHydrated();
    } catch (error) {
      console.error('Error during auth hydration:', error);
      // Marcar como hidratado incluso si hay error para evitar loops
      setHydrated();
    }
  }, [setToken, setUserData, setSystemData, isHydrated, setHydrated]);

  return { isHydrated };
}
