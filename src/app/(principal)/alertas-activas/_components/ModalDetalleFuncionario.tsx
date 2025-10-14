"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Loader2 } from "lucide-react";
import { Personal } from "@/services/personalService";
import { MapaSeleccionUbicacion } from "./MapaSeleccionUbicacion";
import { RolAtencion } from "@/types/enums";

interface Turno {
  id: string;
  nombre: string;
  inicioHora: string;
  finHora: string;
}

interface FuncionarioConConfiguracion extends Personal {
  rolAtencion: RolAtencion;
  turnoId: string;
  ubicacion?: [number, number];
}

interface ModalDetalleFuncionarioProps {
  abierto: boolean;
  onCerrar: () => void;
  funcionario: Personal | null;
  turnos: Turno[];
  onConfirmar: (configuracion: FuncionarioConConfiguracion) => void;
  cargando?: boolean;
  personalSeleccionado?: FuncionarioConConfiguracion[];
  idAtencion?: string; // Para ocultar opciones de rol cuando se agrega a atención existente
}

// Interfaces duplicadas de types para refactorización
// De request/atenciones.ts
// Enum movido a src/types/enums.ts

export function ModalDetalleFuncionario({
  abierto,
  onCerrar,
  funcionario,
  turnos,
  onConfirmar,
  cargando = false,
  personalSeleccionado = [],
  idAtencion,
}: ModalDetalleFuncionarioProps) {
  const [rolAtencion, setRolAtencion] = useState<RolAtencion>(RolAtencion.APOYO);
  const [turnoId, setTurnoId] = useState("1");
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<[number, number] | null>(null);
  const [mapaAbierto, setMapaAbierto] = useState(false);

  // Verificar si ya hay un encargado seleccionado (excluyendo el funcionario actual)
  const yaHayEncargado = personalSeleccionado.some((p) => p.rolAtencion === RolAtencion.ENCARGADO && p.id !== funcionario?.id);

  // Actualizar estado inicial cuando se abre el modal
  useEffect(() => {
    if (abierto && funcionario) {
      const yaSeleccionado = personalSeleccionado.find((p) => p.id === funcionario.id);
      if (yaSeleccionado) {
        setRolAtencion(idAtencion ? RolAtencion.APOYO : yaSeleccionado.rolAtencion);
        setTurnoId(yaSeleccionado.turnoId);
        setUbicacionSeleccionada(yaSeleccionado.ubicacion || null);
      } else {
        setRolAtencion(RolAtencion.APOYO);
        setTurnoId("1");
        setUbicacionSeleccionada(null);
      }
    }
  }, [abierto, funcionario, personalSeleccionado, idAtencion]);

  const manejarConfirmar = () => {
    if (!funcionario) return;

    const configuracion: FuncionarioConConfiguracion = {
      ...funcionario,
      rolAtencion,
      turnoId,
      ubicacion: ubicacionSeleccionada || undefined,
    };

    onConfirmar(configuracion);
    manejarCerrar();
  };

  const manejarCerrar = () => {
    setRolAtencion(RolAtencion.APOYO);
    setTurnoId("1");
    setUbicacionSeleccionada(null);
    setMapaAbierto(false);
    onCerrar();
  };

  if (!funcionario) return null;

  return (
    <>
      <Dialog open={abierto} onOpenChange={manejarCerrar}>
        <DialogContent className="sm:max-w-md z-[10005] data-[state=open]:z-[10005]">
          <DialogHeader>
            <DialogTitle>Detalles del Funcionario</DialogTitle>
            <DialogDescription>
              {idAtencion ? "Configure el turno y ubicación del funcionario (rol: Apoyo)" : "Defina el rol, turno y ubicación del funcionario"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Información del Funcionario */}
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">{funcionario.grado.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {funcionario.grado} {funcionario.nombreCompleto}
                </p>
                <p className="text-xs text-muted-foreground">{funcionario.unidad}</p>
              </div>
            </div>

            {/* Rol de Atención - Solo mostrar cuando no hay idAtencion */}
            {!idAtencion && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Rol de Atención</Label>
                <RadioGroup
                  value={rolAtencion}
                  onValueChange={(value) => setRolAtencion(value as RolAtencion)}
                  disabled={cargando}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={RolAtencion.ENCARGADO} id="config-encargado" />
                    <Label htmlFor="config-encargado" className="font-normal cursor-pointer">
                      Encargado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={RolAtencion.APOYO} id="config-apoyo" />
                    <Label htmlFor="config-apoyo" className="font-normal cursor-pointer">
                      Apoyo
                    </Label>
                  </div>
                </RadioGroup>
                {rolAtencion === RolAtencion.ENCARGADO && yaHayEncargado && (
                  <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-2">
                    Ya hay un encargado seleccionado. Al confirmar, el rol del encargado actual cambiará automáticamente a &quot;Apoyo&quot;.
                  </div>
                )}
              </div>
            )}

            {/* Turno de Servicio */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Turno de Servicio</Label>
              <Select value={turnoId} onValueChange={setTurnoId} disabled={cargando}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar turno" />
                </SelectTrigger>
                <SelectContent className="z-[10010]">
                  {turnos.map((turno) => (
                    <SelectItem key={turno.id} value={turno.id}>
                      {turno.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ubicación */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Ubicación de Trabajo</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMapaAbierto(true)}
                disabled={cargando}
                className="w-full flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {ubicacionSeleccionada ? "Ubicación seleccionada" : "Seleccionar ubicación en mapa"}
              </Button>
              {ubicacionSeleccionada && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Coordenadas: {ubicacionSeleccionada[0].toFixed(6)}, {ubicacionSeleccionada[1].toFixed(6)}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={manejarCerrar} disabled={cargando}>
              Cancelar
            </Button>
            <Button onClick={manejarConfirmar} disabled={cargando} className="min-w-[100px]">
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agregando...
                </>
              ) : (
                "Agregar Funcionario"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para seleccionar ubicación */}
      <Dialog open={mapaAbierto} onOpenChange={setMapaAbierto}>
        <DialogContent className="sm:max-w-2xl z-[10006] data-[state=open]:z-[10006]">
          <DialogHeader>
            <DialogTitle>Seleccionar Ubicación</DialogTitle>
            <DialogDescription>
              Seleccione la ubicación de trabajo para {funcionario.grado} {funcionario.nombreCompleto}
            </DialogDescription>
          </DialogHeader>
          <MapaSeleccionUbicacion
            ubicacionInicial={ubicacionSeleccionada || undefined}
            onUbicacionSeleccionada={setUbicacionSeleccionada}
            onAceptar={() => setMapaAbierto(false)}
            onCancelar={() => setMapaAbierto(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
