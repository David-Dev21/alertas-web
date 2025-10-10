'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, RefreshCw, MapPin } from 'lucide-react';
import { useUbicacionesOperativosStore } from '@/stores/alertas/ubicacionesOperativosStore';
import { toast } from 'sonner';

interface GestionUbicacionesProps {
  idAlerta: string;
  totalUbicaciones: number;
  onLimpiar?: () => void;
}

export function GestionUbicaciones({ idAlerta, totalUbicaciones, onLimpiar }: GestionUbicacionesProps) {
  const { limpiarUbicacionesAlerta } = useUbicacionesOperativosStore();

  const limpiarTodasLasUbicaciones = () => {
    limpiarUbicacionesAlerta(idAlerta);
    toast.success('Ubicaciones limpiadas del almacenamiento local');
    onLimpiar?.();
  };

  if (totalUbicaciones === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
          <MapPin className="w-4 h-4" />
          Gestión de Ubicaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-amber-600 dark:text-amber-300">{totalUbicaciones} ubicaciones en memoria local</div>
          <Button
            variant="outline"
            size="sm"
            onClick={limpiarTodasLasUbicaciones}
            className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/40"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Limpiar Todo
          </Button>
        </div>
        <p className="text-xs text-amber-600/80 dark:text-amber-300/80 mt-2">Las ubicaciones se eliminan automáticamente al asignar funcionarios</p>
      </CardContent>
    </Card>
  );
}
