'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MapPin, Wifi, WifiOff } from 'lucide-react';
import { alertasSocketService } from '@/services/alertas/alertasSocketService';
import { useAutenticacionStore } from '@/stores/autenticacion/autenticacionStore';

export function EstadoConexion() {
  const { userData } = useAutenticacionStore();
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    const manejarCambioConexion = (estaConectado: boolean) => {
      setConectado(estaConectado);
    };

    // Suscribirse a cambios de conexión
    alertasSocketService.onConexionCambiada(manejarCambioConexion);

    // Cleanup: desuscribirse al desmontar
    return () => {
      alertasSocketService.offConexionCambiada(manejarCambioConexion);
    };
  }, []);

  if (!userData?.ubicacion) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Estado de conexión WebSocket */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={conectado ? 'default' : 'destructive'} className="flex items-center gap-1 text-xs">
              {conectado ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {conectado ? 'Conectado' : 'Desconectado'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{conectado ? 'Conectado al sistema de alertas en tiempo real' : 'Sin conexión al sistema de alertas'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Información del departamento */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              {userData.ubicacion.departamento}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Monitoreando alertas del departamento: {userData.ubicacion.departamento}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
