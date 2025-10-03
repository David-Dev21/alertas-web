"use client";
import { useAutenticacionHydration } from "@/hooks/autenticacion/useAutenticacionHydration";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";
import { useEffect, useState } from "react";

/**
 * Componente que inicializa el estado de autenticación al cargar la aplicación.
 * Restaura datos del usuario desde localStorage si existen y limpia alertas locales
 * que ya no existan en la base de datos.
 */
export function InicializadorAutenticacion({ children }: { children: React.ReactNode }) {
  const [montado, setMontado] = useState(false);

  // Hidratar auth
  const { estaHidratado } = useAutenticacionHydration();
  const { estaAutenticado, datosUsuario } = useAuth();

  useEffect(() => {
    setMontado(true);
  }, []);

  // Mostrar loading mientras se hidrata
  if (!montado || !estaHidratado) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si está hidratado pero no autenticado, no mostrar nada (middleware redirigirá)
  if (!estaAutenticado || !datosUsuario) {
    console.log("❌ No autenticado después de hidratar");
    return null;
  }

  console.log("✅ Usuario autenticado:", datosUsuario);
  return <>{children}</>;
}
