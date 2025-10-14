"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  obtenerMetricasGenerales,
  obtenerAlertasGeograficas,
  obtenerMetricasTiempo,
  type MetricasGenerales,
  type AlertasGeograficas,
  type MetricasTiempo,
} from "@/services/dashboard/metricasGenerales";

export default function DashboardPage() {
  const [metricasGenerales, setMetricasGenerales] = useState<MetricasGenerales | null>(null);
  const [alertasGeograficas, setAlertasGeograficas] = useState<AlertasGeograficas | null>(null);
  const [metricasTiempo, setMetricasTiempo] = useState<MetricasTiempo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [metricasGen, alertasGeo, metricasTiem] = await Promise.all([
          obtenerMetricasGenerales(),
          obtenerAlertasGeograficas(),
          obtenerMetricasTiempo(),
        ]);
        setMetricasGenerales(metricasGen);
        setAlertasGeograficas(alertasGeo);
        setMetricasTiempo(metricasTiem);
      } catch (err) {
        setError("Error al cargar los datos del dashboard");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Dashboard de Emergencias</h1>
          <p className="text-muted-foreground">Panel de control y estadísticas del sistema de alertas</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Dashboard de Emergencias</h1>
          <p className="text-muted-foreground">Panel de control y estadísticas del sistema de alertas</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard de Emergencias</h1>
        <p className="text-muted-foreground">Panel de control y estadísticas del sistema de alertas</p>
      </div>

      {/* Métricas Generales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasGenerales?.alertasActivas || 0}</div>
            <p className="text-xs text-muted-foreground">Alertas en proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasGenerales?.alertasPendientes || 0}</div>
            <p className="text-xs text-muted-foreground">Esperando asignación</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Resueltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasGenerales?.alertasResueltas || 0}</div>
            <p className="text-xs text-muted-foreground">Completadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasGenerales?.tiempoPromedioRegistro || "00:00:00"}</div>
            <p className="text-xs text-muted-foreground">Desde recepción</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Tiempo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tiempo Promedio Asignación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasTiempo?.tiempoPromedioAsignacion || "00:00:00"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tiempo Promedio Atención Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasTiempo?.tiempoPromedioAtencionTotal || "00:00:00"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Métricas por Origen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metricasTiempo?.metricasPorOrigen.map((metrica) => (
                <div key={metrica.origen} className="flex justify-between">
                  <span className="text-sm">{metrica.origen}</span>
                  <Badge variant="outline">{metrica.cantidadAlertas} alertas</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Geográficas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Activas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertasGeograficas?.departamentos.map((dep) => (
                  <TableRow key={dep.nombreDepartamento}>
                    <TableCell>{dep.nombreDepartamento}</TableCell>
                    <TableCell className="text-right">{dep.totalAlertas}</TableCell>
                    <TableCell className="text-right">{dep.alertasActivas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provincias</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provincia</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Activas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertasGeograficas?.provincias.map((prov) => (
                  <TableRow key={prov.nombreProvincia}>
                    <TableCell>{prov.nombreProvincia}</TableCell>
                    <TableCell className="text-right">{prov.totalAlertas}</TableCell>
                    <TableCell className="text-right">{prov.alertasActivas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Municipios</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Municipio</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Activas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertasGeograficas?.municipios.map((mun) => (
                  <TableRow key={mun.idMunicipio}>
                    <TableCell>{mun.nombreMunicipio}</TableCell>
                    <TableCell className="text-right">{mun.totalAlertas}</TableCell>
                    <TableCell className="text-right">{mun.alertasActivas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
