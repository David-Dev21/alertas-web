"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserPlus, Loader2, AlertCircle, MapPin } from "lucide-react";
import { RolAtencion, CrearAtencionExternaRequest } from "@/types/atenciones/Atencion";
import { useAtencionesExternas } from "@/hooks/atenciones/useAtencionesExternas";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";

interface Turno {
  id: string;
  nombre: string;
  inicioHora: string; // HH:MM:SS
  finHora: string; // HH:MM:SS
}

const TURNOS: Turno[] = [
  { id: "1", nombre: "1er Turno (07:00 - 13:00)", inicioHora: "07:00:00", finHora: "13:00:00" },
  { id: "2", nombre: "2do Turno (13:00 - 19:00)", inicioHora: "13:00:00", finHora: "19:00:00" },
  { id: "3", nombre: "3er Turno (19:00 - 01:00)", inicioHora: "19:00:00", finHora: "01:00:00" },
  { id: "4", nombre: "4to Turno (01:00 - 07:00)", inicioHora: "01:00:00", finHora: "07:00:00" },
  { id: "5", nombre: "Turno 24 horas (07:00 - 07:00)", inicioHora: "07:00:00", finHora: "07:00:00" },
  { id: "6", nombre: "Turno 48 horas (07:00 - 07:00)", inicioHora: "07:00:00", finHora: "07:00:00" },
];

function calcularTimestampsTurno(turnoId: string): { turnoInicio: string; turnoFin: string } {
  const turno = TURNOS.find((t) => t.id === turnoId);
  if (!turno) throw new Error("Turno no encontrado");

  const now = new Date();
  const [inicioH, inicioM, inicioS] = turno.inicioHora.split(":").map(Number);
  const [finH, finM, finS] = turno.finHora.split(":").map(Number);

  const turnoInicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), inicioH, inicioM, inicioS);

  let turnoFin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), finH, finM, finS);

  // Si fin es menor que inicio, significa que cruza medianoche, sumar 1 día
  if (finH < inicioH || (finH === inicioH && finM < inicioM)) {
    turnoFin.setDate(turnoFin.getDate() + 1);
  }

  // Para turno 24 horas, sumar 1 día a fin
  if (turnoId === "5") {
    turnoFin.setDate(turnoFin.getDate() + 1);
  }

  // Para turno 48 horas, sumar 2 días a fin
  if (turnoId === "6") {
    turnoFin.setDate(turnoFin.getDate() + 2);
  }

  return {
    turnoInicio: turnoInicio.toISOString(),
    turnoFin: turnoFin.toISOString(),
  };
}

interface ModalAsignarFuncionarioExternoProps {
  idAlerta: string;
  idAtencion?: string; // Para agregar funcionarios a una atención existente
  onAsignacionExitosa?: () => void;
}

export function ModalAsignarFuncionarioExterno({ idAlerta, idAtencion, onAsignacionExitosa }: ModalAsignarFuncionarioExternoProps) {
  const [abierto, setAbierto] = useState(false);
  const [siglaVehiculo, setSiglaVehiculo] = useState("");
  const [siglaRadio, setSiglaRadio] = useState("");
  const [rolAtencion, setRolAtencion] = useState<RolAtencion | null>(null);
  const [turnoId, setTurnoId] = useState("1");
  const [grado, setGrado] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [organismo, setOrganismo] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<[number, number] | null>(null);
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const { usuario } = useAuth();
  const { crearAtencionExterna, agregarFuncionarioExterno, cargando } = useAtencionesExternas();

  const manejarAsignacion = async () => {
    if (!usuario?.idUsuario) {
      console.error("No hay usuario autenticado");
      return;
    }

    const { turnoInicio, turnoFin } = calcularTimestampsTurno(turnoId);

    // Datos del funcionario externo
    const datosFuncionario = {
      rolAtencion: rolAtencion || RolAtencion.APOYO,
      ...(ubicacionSeleccionada && {
        ubicacion: {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: ubicacionSeleccionada,
          },
          properties: {
            accuracy: 5,
            timestamp: new Date().toISOString(),
          },
        },
      }),
      turnoInicio,
      turnoFin,
      funcionarioExterno: {
        grado: grado.trim(),
        nombreCompleto: nombreCompleto.trim(),
        organismo: organismo.trim(),
        unidad: unidad.trim(),
      },
    };

    let resultado;

    if (idAtencion) {
      // Agregar funcionario a atención existente
      resultado = await agregarFuncionarioExterno(idAtencion, datosFuncionario);
    } else {
      // Crear nueva atención
      const datosAtencion: CrearAtencionExternaRequest = {
        idAlerta,
        idUsuarioAdmin: usuario.idUsuario,
        siglaVehiculo: siglaVehiculo.trim(),
        siglaRadio: siglaRadio.trim(),
        funcionarios: [datosFuncionario],
      };
      resultado = await crearAtencionExterna(datosAtencion);
    }

    if (resultado) {
      setAbierto(false);
      setSiglaVehiculo("");
      setSiglaRadio("");
      setRolAtencion(null);
      setTurnoId("1");
      setGrado("");
      setNombreCompleto("");
      setOrganismo("");
      setUnidad("");
      setUbicacionSeleccionada(null);
      onAsignacionExitosa?.();
    }
  };

  return (
    <>
      <Dialog
        open={abierto}
        onOpenChange={(open) => {
          setAbierto(open);
        }}
      >
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            {idAtencion ? "Agregar Funcionario Externo" : "Asignar Funcionario Externo"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px] z-[10001] data-[state=open]:z-[10001]">
          <DialogHeader>
            <DialogTitle>{idAtencion ? "Agregar Funcionario Externo" : "Asignar Funcionario Externo"}</DialogTitle>
            <DialogDescription>
              {idAtencion
                ? "Agregue un nuevo funcionario externo a la atención existente."
                : "Complete la información del funcionario externo y los detalles de la asignación."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Columna Izquierda: Detalles de la Asignación */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h4 className="text-base font-semibold tracking-tight">Detalles de la Asignación</h4>
              </div>

              {/* Solo mostrar campos de vehículo si no hay idAtencion */}
              {!idAtencion && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siglaVehiculo">Sigla Vehículo</Label>
                      <Input
                        id="siglaVehiculo"
                        placeholder="ej: VEH-001"
                        value={siglaVehiculo}
                        onChange={(e) => setSiglaVehiculo(e.target.value)}
                        disabled={cargando}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="siglaRadio">Sigla Radio</Label>
                      <Input
                        id="siglaRadio"
                        placeholder="ej: RAD-001"
                        value={siglaRadio}
                        onChange={(e) => setSiglaRadio(e.target.value)}
                        disabled={cargando}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between space-x-4">
                <div className="space-y-2">
                  <Label className="text-sm">Rol de Atención</Label>
                  <RadioGroup
                    value={rolAtencion || ""}
                    onValueChange={(value) => setRolAtencion(value as RolAtencion)}
                    disabled={cargando}
                    className="z-[10002] flex-col items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={RolAtencion.ENCARGADO} id="encargado" />
                      <Label htmlFor="encargado" className="font-normal text-white/80">
                        Encargado
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={RolAtencion.APOYO} id="apoyo" />
                      <Label htmlFor="apoyo" className="font-normal text-white/80">
                        Apoyo
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turnoServicio" className="text-sm">
                    Turno de Servicio
                  </Label>
                  <Select value={turnoId} onValueChange={setTurnoId} disabled={cargando}>
                    <SelectTrigger className="z-[10002] w-56">
                      <SelectValue placeholder="Seleccionar turno" />
                    </SelectTrigger>
                    <SelectContent className="z-[10003]">
                      {TURNOS.map((turno) => (
                        <SelectItem key={turno.id} value={turno.id}>
                          {turno.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Ubicación de Trabajo</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMapaAbierto(true)}
                  disabled={cargando}
                  className="flex-1 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Seleccionar Ubicación en Mapa
                </Button>
                {ubicacionSeleccionada && <span className="text-xs text-green-600">¡Ubicación seleccionada!</span>}
              </div>
            </div>

            {/* Columna Derecha: Datos del Funcionario */}
            <div className="space-y-6">
              <div className="border-b pb-2">
                <h4 className="text-base font-semibold tracking-tight">Datos del Funcionario Externo</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grado">Grado</Label>
                  <Input id="grado" placeholder="ej: Sargento" value={grado} onChange={(e) => setGrado(e.target.value)} disabled={cargando} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                  <Input
                    id="nombreCompleto"
                    placeholder="ej: Juan Pérez García"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    disabled={cargando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organismo">Organismo</Label>
                  <Input
                    id="organismo"
                    placeholder="ej: Policía Nacional"
                    value={organismo}
                    onChange={(e) => setOrganismo(e.target.value)}
                    disabled={cargando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidad">Unidad</Label>
                  <Input
                    id="unidad"
                    placeholder="ej: Unidad de Emergencias"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    disabled={cargando}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAbierto(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button onClick={manejarAsignacion} disabled={cargando} className="min-w-[120px]">
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {idAtencion ? "Agregando..." : "Asignando..."}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {idAtencion ? "Agregar" : "Asignar"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para seleccionar ubicación */}
      <Dialog open={mapaAbierto} onOpenChange={setMapaAbierto}>
        <DialogContent className="sm:max-w-2xl z-[10004] data-[state=open]:z-[10004]">
          <DialogHeader>
            <DialogTitle>Seleccionar Ubicación</DialogTitle>
          </DialogHeader>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Mapa para seleccionar ubicación (implementar con Leaflet)</p>
            {/* Aquí iría el componente de mapa para selección */}
          </div>
          <DialogFooter>
            <Button onClick={() => setMapaAbierto(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
