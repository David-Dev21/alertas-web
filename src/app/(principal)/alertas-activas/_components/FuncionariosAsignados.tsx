"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, User, Radio, Car, Clock } from "lucide-react";

interface FuncionarioAsignado {
  id: string;
  idUsuarioOperativo: string | null;
  rolAtencion: string;
  ubicacion: string | null;
  turnoInicio: string;
  turnoFin: string;
  funcionarioExterno: {
    grado: string;
    nombreCompleto: string;
    organismo?: string;
    unidad: string;
  };
}

interface Atencion {
  id: string;
  siglaVehiculo?: string;
  siglaRadio?: string;
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
          Funcionarios Asignados ({funcionarios.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de Recursos */}
        {(atencion.siglaVehiculo || atencion.siglaRadio) && (
          <div className="grid grid-cols-2 gap-3">
            {atencion.siglaVehiculo && (
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Código de vehículo:</span>
                  <div className="font-mono text-sm">{atencion.siglaVehiculo}</div>
                </div>
              </div>
            )}
            {atencion.siglaRadio && (
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Codigo de Radio: </span>
                  <div className="font-mono text-sm">{atencion.siglaRadio}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lista de Funcionarios */}
        <div>
          <h4 className="font-medium text-sm mb-3">Funcionarios en Atención</h4>
          <div className="space-y-2">
            {funcionarios.map((funcionario: FuncionarioAsignado, index: number) => (
              <div key={funcionario.id} className="border rounded-lg p-4 bg-card">
                {/* Encabezado del Funcionario */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm">
                        {funcionario.funcionarioExterno.grado} {funcionario.funcionarioExterno.nombreCompleto}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {funcionario.funcionarioExterno.organismo ? `${funcionario.funcionarioExterno.organismo} - ` : ""}
                        {funcionario.funcionarioExterno.unidad}
                      </p>
                    </div>
                  </div>
                  <Badge variant={funcionario.rolAtencion === "ENCARGADO" ? "default" : "secondary"} className="text-xs">
                    {funcionario.rolAtencion}
                  </Badge>
                </div>

                {/* Separador */}
                <div className="border-t border-border/50 my-3"></div>

                {/* Información del Turno */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="text-xs">
                    <span className="font-medium text-muted-foreground">Turno de Servicio:</span>
                    <span className="ml-1 text-foreground">{formatearTurno(funcionario.turnoInicio, funcionario.turnoFin)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
