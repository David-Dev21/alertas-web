"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EstadoAlerta, obtenerTextoEstado } from "@/types/alertas/Alerta";
import { Loading } from "@/components/EstadoCarga";
import { ErrorEstado } from "@/components/ErrorEstado";
import { useHistorialVictima } from "@/hooks/victimas/useHistorialVictima";

export default function VictimaPage() {
  const params = useParams();
  const idVictima = params.id as string;

  const { historial, loading, error, reintentar } = useHistorialVictima(idVictima);

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case EstadoAlerta.PENDIENTE:
        return "secondary";
      case EstadoAlerta.ASIGNADA:
        return "outline";
      case EstadoAlerta.EN_ATENCION:
        return "default";
      case EstadoAlerta.RESUELTA:
        return "default";
      case EstadoAlerta.CANCELADA:
        return "destructive";
      case EstadoAlerta.FALSA_ALERTA:
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/victimas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Historial de Alertas</h1>
            <p className="text-muted-foreground">Cargando información...</p>
          </div>
        </div>
        <Loading mensaje="Cargando historial de alertas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/victimas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Víctimas
            </Link>
          </Button>
        </div>
        <ErrorEstado mensaje={error} onReintentar={reintentar} enlaceVolver="/victimas" />
      </div>
    );
  }

  if (!historial) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/victimas">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Víctimas
            </Link>
          </Button>
        </div>
        <ErrorEstado mensaje="No se pudo cargar el historial" enlaceVolver="/victimas" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Historial de Alertas</h1>
          <p className="text-muted-foreground">Información de la víctima y su historial de alertas</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/victimas">
            <ArrowLeft />
            Volver a Víctimas
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Víctima</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Nombres:</span>
                <Badge variant="outline">{historial.victima.nombres}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Apellidos:</span>
                <Badge variant="outline">{historial.victima.apellidos}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Cédula:</span>
                <Badge variant="outline">{historial.victima.cedulaIdentidad}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Fecha Nacimiento:</span>
                <Badge variant="outline">
                  {historial.victima.fechaNacimiento ? new Date(historial.victima.fechaNacimiento).toLocaleDateString("es-ES") : "No disponible"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Celular:</span>
                <Badge variant="outline">{historial.victima.celular}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Alertas:</span>
                <Badge>{historial.estadisticas.totalAlertas}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Alertas Activas:</span>
                <Badge variant="secondary">{historial.estadisticas.alertasActivas}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Alertas Finalizadas:</span>
                <Badge variant="outline">{historial.estadisticas.alertasFinalizadas}</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Alertas por Estado:</h4>
                {Object.entries(historial.estadisticas.alertasPorEstado).map(([estado, cantidad]) => (
                  <div key={estado} className="flex justify-between items-center">
                    <span className="text-sm">{obtenerTextoEstado(estado)}:</span>
                    <Badge variant="destructive">{cantidad as number}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Historial de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Código Denuncia</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tiempos</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historial.alertas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No hay alertas registradas</TableCell>
                </TableRow>
              ) : (
                historial.alertas.map((alerta) => (
                  <TableRow key={alerta.idAlerta}>
                    <TableCell>
                      {new Date(alerta.fechaHora).toLocaleString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadgeVariant(alerta.estadoAlerta)}>{obtenerTextoEstado(alerta.estadoAlerta)}</Badge>
                    </TableCell>
                    <TableCell>{alerta.origen}</TableCell>
                    <TableCell>CUD: {alerta.codigoCud}</TableCell>
                    <TableCell>
                      {alerta.municipio}
                      <br />
                      {alerta.provincia}, {alerta.departamento}
                    </TableCell>
                    <TableCell>
                      Asignación: {alerta.tiempoAsignacion}
                      <br />
                      Cierre: {alerta.tiempoCierre}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/historial-alertas/${alerta.idAlerta}`}>Ver</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
