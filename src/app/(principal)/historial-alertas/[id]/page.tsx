'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/EstadoCarga';
import { ErrorEstado } from '@/components/ErrorEstado';
import { AlertTriangle, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { alertasService } from '@/services/alertas/alertasService';
import { Alerta } from '@/types/alertas/Alerta';
import { LeafletWrapper } from '@/app/(principal)/alertas-activas/_components/LeafletWrapper';
import { DatosVictimas } from '@/app/(principal)/alertas-activas/_components/DatosVictimas';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface PageProps {
  params: { id: string };
}

export default function HistorialAlertaDetallePage({ params }: PageProps) {
  const { id } = params;
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const cargar = async () => {
      try {
        const datos = await alertasService.obtenerPorId(id);
        if (mounted) setAlerta(datos);
      } catch (err: any) {
        console.error('Error al cargar alerta historial:', err);
        if (mounted) setError(err?.message || 'Error al cargar alerta');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    cargar();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading mensaje="Cargando detalle del historial..." />;
  }

  if (error) {
    return <ErrorEstado mensaje={error} enlaceVolver="/historial-alertas" />;
  }

  if (!alerta) {
    return (
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>No encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No se encontró la alerta solicitada.</p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/historial-alertas">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tieneUbicacion = Boolean(alerta.ubicacion && Array.isArray(alerta.ubicacion.geometry.coordinates));
  const lat = tieneUbicacion ? alerta.ubicacion!.geometry.coordinates[1] : 17.395; // default
  const lng = tieneUbicacion ? alerta.ubicacion!.geometry.coordinates[0] : -66.158;

  // ubicaciones estáticas ejemplo alrededor de la alerta
  const ubicacionesEstaticas = [
    { nombre: 'Operativo A (estático)', lat: lat + 0.001, lng: lng + 0.001 },
    { nombre: 'Operativo B (estático)', lat: lat - 0.001, lng: lng - 0.001 },
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detalle de Alerta (Historial)</h2>
          <p className="text-muted-foreground">Registro: {alerta.codigoRegistro || alerta.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/historial-alertas">Volver</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Ubicación (estática)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tieneUbicacion ? (
                <div className="h-96 rounded-lg overflow-hidden border">
                  <LeafletWrapper>
                    <MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                      <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[lat, lng]}>
                        <Popup>
                          <div className="font-medium">Alerta</div>
                          <div className="text-xs text-muted-foreground">{new Date(alerta.fechaHora).toLocaleString('es-BO')}</div>
                        </Popup>
                      </Marker>
                      {ubicacionesEstaticas.map((u, i) => (
                        <Marker key={i} position={[u.lat, u.lng]}>
                          <Popup>
                            <div className="font-medium">{u.nombre}</div>
                            <div className="text-xs text-muted-foreground">Marcador estático</div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </LeafletWrapper>
                </div>
              ) : (
                <div className="text-muted-foreground">No hay coordenadas GPS para esta alerta.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionarios / Operativos (estáticos)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-6 text-sm text-muted-foreground">
                <li>Operativo A - {`${(lat + 0.001).toFixed(6)}, ${(lng + 0.001).toFixed(6)}`}</li>
                <li>Operativo B - {`${(lat - 0.001).toFixed(6)}, ${(lng - 0.001).toFixed(6)}`}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <DatosVictimas victima={alerta.victima as any} />

          <Card>
            <CardHeader>
              <CardTitle>Metadatos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Origen:</strong> {alerta.origen}
              </p>
              <p>
                <strong>Estado:</strong> {alerta.estadoAlerta}
              </p>
              <p>
                <strong>Fecha:</strong> {new Date(alerta.fechaHora).toLocaleString('es-BO')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
