"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Radio, Car, Clock } from "lucide-react";
import type { FuncionarioAsignado } from "@/services/alertas/alertasService";

interface Atencion {
  id: string;
  siglaVehiculo?: string;
  siglaRadio?: string;
  gradoUsuarioWeb?: string;
  nombreCompletoUsuarioWeb?: string;
  atencionFuncionario?: FuncionarioAsignado[];
}

interface FuncionariosAsignadosProps {
  atencion?: Atencion;
}

export function FuncionariosAsignados({ atencion }: FuncionariosAsignadosProps) {
  const funcionarios = atencion?.atencionFuncionario || [];

  const formatearTurno = (turnoInicio: string, turnoFin: string) => {
    const inicio = new Date(turnoInicio);
    const fin = new Date(turnoFin);

    const opcionesFecha: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const diaInicio = inicio.toLocaleDateString("es-ES", opcionesFecha);
    const diaFin = fin.toLocaleDateString("es-ES", opcionesFecha);
    const horaInicio = inicio.toLocaleTimeString("es-ES", opcionesHora);
    const horaFin = fin.toLocaleTimeString("es-ES", opcionesHora);

    if (inicio.toDateString() === fin.toDateString()) {
      return `${diaInicio}, de ${horaInicio} a ${horaFin}`;
    } else {
      return `Del ${diaInicio} ${horaInicio} al ${diaFin} ${horaFin}`;
    }
  };

  if (!atencion || funcionarios.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5" />
            Funcionarios Asignados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Sin funcionarios asignados</p>
            <p className="text-xs">Los funcionarios asignados aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Información de la Atención
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información General de la Atención */}
        <div className="space-y-4">
          {/* Despachador y Recursos en una sola fila */}
          <div className="flex gap-4">
            {/* Usuario Despachador */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg flex-[2] min-w-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Despachador</p>
                <p className="text-sm font-medium truncate">
                  {atencion.gradoUsuarioWeb || atencion.nombreCompletoUsuarioWeb
                    ? `${atencion.gradoUsuarioWeb || ""} ${atencion.nombreCompletoUsuarioWeb || ""}`.trim()
                    : "No asignado"}
                </p>
              </div>
            </div>

            {/* Vehículo */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Car className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Vehículo</p>
                <p className={`font-medium font-mono truncate ${atencion.siglaVehiculo ? "text-sm" : "text-xs opacity-60"}`}>
                  {atencion.siglaVehiculo || "—"}
                </p>
              </div>
            </div>

            {/* Radio */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Radio</p>
                <p className={`font-medium font-mono truncate ${atencion.siglaRadio ? "text-sm" : "text-xs opacity-60"}`}>
                  {atencion.siglaRadio || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Funcionarios Asignados */}
        <div className="space-y-4">
          {funcionarios.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay funcionarios asignados</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground pb-2"> Funcionarios Asignados ({funcionarios.length})</h4>
              {funcionarios.map((funcionario: FuncionarioAsignado) => (
                <div key={funcionario.id} className="border rounded-lg p-4 bg-card">
                  {/* Información del Funcionario en 3 columnas */}
                  <div className="grid grid-cols-4 gap-4 items-start">
                    {/* Columna 1: Grado, Nombre y Unidad (ocupa 2 columnas) */}
                    <div className="col-span-2 flex items-center gap-3 my-auto">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm">
                          {funcionario.grado || funcionario.funcionarioExterno?.grado}{" "}
                          {funcionario.nombreCompleto || funcionario.funcionarioExterno?.nombreCompleto}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {funcionario.funcionarioExterno?.organismo ? `${funcionario.funcionarioExterno.organismo} - ` : ""}
                          {funcionario.unidad || funcionario.funcionarioExterno?.unidad}
                        </p>
                      </div>
                    </div>

                    {/* Columna 2: Turno */}
                    <div className="flex items-center gap-2 my-auto">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-medium text-muted-foreground">Turno:</span>
                        <span className="ml-1 text-foreground">{formatearTurno(funcionario.turnoInicio, funcionario.turnoFin)}</span>
                      </div>
                    </div>

                    {/* Columna 3: Rol de Atención */}
                    <div className="flex justify-center items-center my-auto">
                      <Badge variant={funcionario.rolAtencion === "ENCARGADO" ? "default" : "secondary"} className="text-xs">
                        {funcionario.rolAtencion}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
