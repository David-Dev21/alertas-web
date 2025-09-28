'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFuncionariosUbicacion, UbicacionFuncionario } from '@/hooks/funcionarios/useFuncionariosUbicacion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Navigation, Clock, Phone } from 'lucide-react';

// Importar componentes de Leaflet dinámicamente
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then((mod) => mod.Circle), { ssr: false });

interface UbicacionesFuncionariosProps {
  ubicacionAlerta?: { latitud: number; longitud: number };
  radioVisibleKm?: number;
  onSeleccionarFuncionario?: (funcionario: UbicacionFuncionario) => void;
}

export function UbicacionesFuncionarios({ ubicacionAlerta, radioVisibleKm = 10, onSeleccionarFuncionario }: UbicacionesFuncionariosProps) {
  const { funcionariosUbicaciones, isLoading, obtenerFuncionariosCercanos, totalFuncionariosConectados, funcionariosDisponibles, isConnected } =
    useFuncionariosUbicacion();

  const [isClient, setIsClient] = useState(false);
  const [funcionariosCercanos, setFuncionariosCercanos] = useState<UbicacionFuncionario[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (ubicacionAlerta) {
      const cercanos = obtenerFuncionariosCercanos(ubicacionAlerta.latitud, ubicacionAlerta.longitud, radioVisibleKm);
      setFuncionariosCercanos(cercanos);
    } else {
      setFuncionariosCercanos([]);
    }
  }, [funcionariosUbicaciones, ubicacionAlerta, radioVisibleKm]); // Quitar obtenerFuncionariosCercanos

  // Configuración por defecto del mapa (La Paz, Bolivia)
  const defaultCenter: [number, number] = ubicacionAlerta ? [ubicacionAlerta.latitud, ubicacionAlerta.longitud] : [-16.5, -68.15];

  if (!isClient) {
    return (
      <Card className="w-full h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Funcionarios Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Panel de estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Funcionarios en Tiempo Real
            </span>
            <div className="flex gap-2">
              <Badge variant="secondary">{totalFuncionariosConectados} conectados</Badge>
              <Badge variant="default">{funcionariosDisponibles} disponibles</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Cargando ubicaciones...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{totalFuncionariosConectados}</p>
                <p className="text-sm text-muted-foreground">Total Conectados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{funcionariosDisponibles}</p>
                <p className="text-sm text-muted-foreground">Disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{funcionariosCercanos.length}</p>
                <p className="text-sm text-muted-foreground">Cercanos ({radioVisibleKm}km)</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapa de funcionarios */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height: '500px', width: '100%' }}>
            <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }} className="rounded-lg">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marcador de la alerta (si existe) */}
              {ubicacionAlerta && (
                <>
                  <Marker position={[ubicacionAlerta.latitud, ubicacionAlerta.longitud]}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-medium">📍 Ubicación de la Alerta</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Círculo de radio visible */}
                  <Circle
                    center={[ubicacionAlerta.latitud, ubicacionAlerta.longitud]}
                    radius={radioVisibleKm * 1000} // metros
                    pathOptions={{
                      color: 'blue',
                      fillColor: 'blue',
                      fillOpacity: 0.1,
                      weight: 2,
                      dashArray: '5, 5',
                    }}
                  />
                </>
              )}

              {/* Marcadores de funcionarios */}
              {funcionariosUbicaciones.map((funcionario) => (
                <Marker key={funcionario.idFuncionario} position={[funcionario.ubicacion.latitud, funcionario.ubicacion.longitud]}>
                  <Popup>
                    <div className="min-w-[200px] p-2">
                      <h3 className="font-medium mb-2">
                        👮‍♂️ {funcionario.nombres} {funcionario.apellidos}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Cargo:</strong> {funcionario.cargo}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={funcionario.disponible ? 'default' : 'secondary'}>
                            {funcionario.disponible ? 'Disponible' : 'Ocupado'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Actualizado: {new Date(funcionario.timestamp).toLocaleTimeString()}</span>
                        </div>
                        {funcionario.distanciaEnMetros && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Navigation className="h-3 w-3" />
                            <span>{(funcionario.distanciaEnMetros / 1000).toFixed(2)} km de distancia</span>
                          </div>
                        )}
                        {onSeleccionarFuncionario && funcionario.disponible && (
                          <Button size="sm" onClick={() => onSeleccionarFuncionario(funcionario)} className="w-full mt-2">
                            Asignar Funcionario
                          </Button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lista de funcionarios cercanos */}
      {ubicacionAlerta && funcionariosCercanos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Navigation className="h-5 w-5" />
              Funcionarios Más Cercanos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funcionariosCercanos.slice(0, 5).map((funcionario, index) => (
                <div
                  key={funcionario.idFuncionario}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        #{index + 1} {funcionario.nombres} {funcionario.apellidos}
                      </span>
                      <Badge variant={funcionario.disponible ? 'default' : 'secondary'}>{funcionario.disponible ? 'Disponible' : 'Ocupado'}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {funcionario.cargo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {(funcionario.distanciaEnMetros! / 1000).toFixed(2)} km
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(funcionario.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {onSeleccionarFuncionario && funcionario.disponible && (
                    <Button size="sm" onClick={() => onSeleccionarFuncionario(funcionario)}>
                      Asignar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
