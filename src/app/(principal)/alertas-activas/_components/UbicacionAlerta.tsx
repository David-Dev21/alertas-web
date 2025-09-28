import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Compass, MapIcon } from 'lucide-react';

interface Props {
  ubicacion: {
    latitud: number;
    longitud: number;
    direccion: string;
    zona?: string;
    referencia?: string;
  };
}

export function UbicacionAlerta({ ubicacion }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapIcon className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">{ubicacion.direccion}</p>
              {ubicacion.zona && <p className="text-sm text-gray-500">Zona: {ubicacion.zona}</p>}
            </div>
          </div>

          {ubicacion.referencia && (
            <div className="flex items-start gap-2">
              <Compass className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-600">{ubicacion.referencia}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>
              {ubicacion.latitud.toFixed(6)}, {ubicacion.longitud.toFixed(6)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
