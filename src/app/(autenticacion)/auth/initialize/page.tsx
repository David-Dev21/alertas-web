'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorEstado } from '@/components/ErrorEstado';
import { useAuth } from '@/hooks/autenticacion/useAutenticacion';

export default function InicializaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setToken, setUserData, setSystemData } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const encodedData = searchParams.get('auth');

        if (!encodedData || !encodedData.length) {
          setError('No se encontraron datos de autenticación');
          return;
        }

        // Decodificar directamente en el cliente
        let authData = JSON.parse(atob(encodedData));

        // Función para corregir codificación de caracteres
        const corregirCodificacion = (obj: any): any => {
          if (typeof obj === 'string') {
            return obj
              .replace(/Ã©/g, 'é')
              .replace(/Ã³/g, 'ó')
              .replace(/Ã±/g, 'ñ')
              .replace(/Ã¡/g, 'á')
              .replace(/Ã­/g, 'í')
              .replace(/Ãº/g, 'ú')
              .replace(/Ã¼/g, 'ü');
          } else if (Array.isArray(obj)) {
            return obj.map(corregirCodificacion);
          } else if (obj && typeof obj === 'object') {
            const corrected: any = {};
            for (const key in obj) {
              corrected[key] = corregirCodificacion(obj[key]);
            }
            return corrected;
          }
          return obj;
        };

        // Corregir codificación en los datos
        authData = corregirCodificacion(authData);

        console.log('Auth data:', authData);

        // Validar que los datos requeridos estén presentes
        if (!authData.access_token || !authData.userData || !authData.systemData) {
          throw new Error('Datos de autenticación incompletos');
        }

        const userData = {
          name: authData.userData.name,
          lastName: authData.userData.lastName,
          fullName: authData.userData.fullName,
          email: authData.userData.email,
          imageUser: authData.userData.imageUser,
          userId: authData.userData.userId,
          username: authData.userData.username,
          active: authData.userData.active,
          verified: authData.userData.verified,
          createdAt: authData.userData.createdAt,
          lastAccess: authData.userData.lastAccess,
          unidad: authData.userData.unidad,
        };

        const systemData = {
          name: authData.systemData.name,
          roles: authData.systemData.roles,
          modules: authData.systemData.modules,
          permissions: authData.systemData.permissions,
        };

        // Actualizar el store de Zustand inmediatamente
        setToken(authData.access_token);
        setUserData(userData);
        setSystemData(systemData);

        setTimeout(() => {
          router.push('/dashboard');
        }, 5000);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error decodificando datos de autenticación');
      }
    };

    initializeAuth();
  }, [searchParams, router, setToken, setUserData, setSystemData]);

  if (error) {
    return <ErrorEstado mensaje={error} enlaceVolver="https://kerveros-dev.policia.bo/auth/login" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto"></div>
        <p className="text-lg font-medium text-muted-foreground">Procesando autenticación...</p>
      </div>
    </div>
  );
}
