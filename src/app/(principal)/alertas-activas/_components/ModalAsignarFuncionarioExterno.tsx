"use client";
import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Loader2, MapPin, Search, Check, X } from "lucide-react";
import { RolAtencion, AgregarFuncionarioExternoRequest } from "@/types/request/atenciones";
import { useAtencionesExternas } from "@/hooks/atenciones/useAtencionesExternas";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";
import { usePersonal } from "@/hooks/personal/usePersonal";
import { Personal } from "@/services/personalService";
import { ModalCrearFuncionario } from "./ModalCrearFuncionario";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { cn } from "@/lib/utils";
import { ModalDetalleFuncionario } from "./ModalDetalleFuncionario";

interface Turno {
  id: string;
  nombre: string;
  inicioHora: string; // HH:MM:SS
  finHora: string; // HH:MM:SS
}

interface FuncionarioConConfiguracion extends Personal {
  rolAtencion: RolAtencion;
  turnoId: string;
  ubicacion?: [number, number];
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
  const [mapaAbierto, setMapaAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [personalEncontrado, setPersonalEncontrado] = useState<Personal[]>([]);
  const [personalSeleccionado, setPersonalSeleccionado] = useState<FuncionarioConConfiguracion[]>([]);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [modalConfiguracionAbierto, setModalConfiguracionAbierto] = useState(false);
  const [funcionarioAConfigurar, setFuncionarioAConfigurar] = useState<Personal | null>(null);
  const [busquedaCompletada, setBusquedaCompletada] = useState(false);
  const { usuario } = useAuth();
  const datosUsuario = useAutenticacionStore((state) => state.datosUsuario);
  const { crearAtencionExterna, agregarFuncionarioExterno, cargando } = useAtencionesExternas();
  const { buscarPersonal, cargando: cargandoBusqueda } = usePersonal();

  const idDepartamento = useMemo(() => datosUsuario?.ubicacion?.idDepartamento, [datosUsuario?.ubicacion?.idDepartamento]);

  const manejarConfiguracionFuncionario = (configuracion: FuncionarioConConfiguracion) => {
    setPersonalSeleccionado((prev) => {
      // Si el rol es ENCARGADO, cambiar todos los demás a APOYO
      if (configuracion.rolAtencion === RolAtencion.ENCARGADO) {
        const nuevosSeleccionados = prev.map((personal) =>
          personal.id === configuracion.id ? configuracion : { ...personal, rolAtencion: RolAtencion.APOYO }
        );
        // Si el funcionario ya estaba seleccionado, actualizarlo; si no, agregarlo
        const yaSeleccionado = prev.some((p) => p.id === configuracion.id);
        if (!yaSeleccionado) {
          nuevosSeleccionados.push(configuracion);
        }
        return nuevosSeleccionados;
      } else {
        // Para rol APOYO, simplemente agregar o actualizar
        const yaSeleccionado = prev.some((p) => p.id === configuracion.id);
        if (yaSeleccionado) {
          return prev.map((personal) => (personal.id === configuracion.id ? configuracion : personal));
        } else {
          return [...prev, configuracion];
        }
      }
    });
  };

  // Búsqueda con debounce
  useEffect(() => {
    if (busqueda.length < 2) {
      setPersonalEncontrado([]);
      setBusquedaCompletada(false);
      return;
    }

    // Resetear estado de búsqueda completada cuando cambia la búsqueda
    setBusquedaCompletada(false);
    setPersonalEncontrado([]);

    const timeoutId = setTimeout(async () => {
      if (idDepartamento) {
        const resultado = await buscarPersonal(busqueda, idDepartamento);
        if (resultado?.exito) {
          setPersonalEncontrado(resultado.datos.personal);
        } else {
          setPersonalEncontrado([]);
        }
        setBusquedaCompletada(true);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [busqueda, idDepartamento, buscarPersonal]);

  const manejarAsignacion = async () => {
    if (!usuario?.idUsuario) {
      console.error("No hay usuario autenticado");
      return;
    }

    if (personalSeleccionado.length === 0) {
      console.error("No hay funcionarios seleccionados");
      return;
    }

    // Crear datos para cada funcionario seleccionado
    const funcionarios = personalSeleccionado.map((personal) => {
      const { turnoInicio, turnoFin } = calcularTimestampsTurno(personal.turnoId);
      return {
        rolAtencion: personal.rolAtencion,
        ...(personal.ubicacion && {
          ubicacion: {
            longitud: personal.ubicacion[1],
            latitud: personal.ubicacion[0],
            precision: 5.2,
            marcaTiempo: new Date().toISOString(),
          },
        }),
        turnoInicio,
        turnoFin,
        idPersonal: personal.id,
      };
    });

    let resultado;

    if (idAtencion) {
      // Agregar múltiples funcionarios a atención existente
      // Para atención existente, usamos idPersonal directamente
      const funcionariosParaAgregar = personalSeleccionado.map((personal) => {
        const { turnoInicio, turnoFin } = calcularTimestampsTurno(personal.turnoId);
        return {
          rolAtencion: RolAtencion.APOYO, // Siempre APOYO para agregados a atención existente
          ...(personal.ubicacion && {
            ubicacion: {
              longitud: personal.ubicacion[1],
              latitud: personal.ubicacion[0],
              precision: 5.2,
              marcaTiempo: new Date().toISOString(),
            },
          }),
          turnoInicio,
          turnoFin,
          idPersonal: personal.id,
        };
      });

      // Para atención existente, agregamos uno por uno
      for (const datosFuncionario of funcionariosParaAgregar) {
        resultado = await agregarFuncionarioExterno(idAtencion, datosFuncionario);
        if (!resultado) break;
      }
    } else {
      // Crear nueva atención con múltiples funcionarios
      // Usar la estructura correcta según la API real
      const funcionariosParaCrear = personalSeleccionado.map((personal) => {
        const { turnoInicio, turnoFin } = calcularTimestampsTurno(personal.turnoId);
        return {
          rolAtencion: personal.rolAtencion,
          ...(personal.ubicacion && {
            ubicacion: {
              longitud: personal.ubicacion[1],
              latitud: personal.ubicacion[0],
              precision: 5.2,
              marcaTiempo: new Date().toISOString(),
            },
          }),
          turnoInicio,
          turnoFin,
          idPersonal: personal.id,
        };
      });

      const datosAtencion = {
        idAlerta,
        idUsuarioWeb: usuario.idUsuario,
        siglaVehiculo: siglaVehiculo.trim(),
        siglaRadio: siglaRadio.trim(),
        funcionarios: funcionariosParaCrear,
      };
      resultado = await crearAtencionExterna(datosAtencion as any);
    }

    if (resultado) {
      setAbierto(false);
      setSiglaVehiculo("");
      setSiglaRadio("");
      setBusqueda("");
      setPersonalEncontrado([]);
      setPersonalSeleccionado([]);
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
          <Button size="sm" variant="default">
            {idAtencion ? "Agregar Funcionario" : "Asignar Funcionario"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl h-[90vh] z-[10001] data-[state=open]:z-[10001] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{idAtencion ? "Agregar Funcionario" : "Asignar Funcionario"}</DialogTitle>
            <DialogDescription>
              {idAtencion
                ? "Agregue un nuevo funcionario a la atención existente."
                : "Complete la información del funcionario y los detalles de la asignación."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {/* Detalles de la Asignación */}
              {!idAtencion && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="siglaVehiculo" className="text-xs">
                        Vehículo
                      </Label>
                      <Input
                        id="siglaVehiculo"
                        placeholder="ej: VEH-001"
                        value={siglaVehiculo}
                        onChange={(e) => setSiglaVehiculo(e.target.value)}
                        disabled={cargando}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="siglaRadio" className="text-xs">
                        Radio
                      </Label>
                      <Input
                        id="siglaRadio"
                        placeholder="ej: RAD-001"
                        value={siglaRadio}
                        onChange={(e) => setSiglaRadio(e.target.value)}
                        disabled={cargando}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Búsqueda de Funcionario */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="busqueda">Buscar por grado o nombre</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="busqueda"
                        placeholder="ej: Sargento Juan"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        disabled={cargando}
                        className="pl-10"
                      />
                      {personalEncontrado.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-[10002] mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                          {personalEncontrado.map((personal) => {
                            const yaSeleccionado = personalSeleccionado.some((p) => p.id === personal.id);
                            return (
                              <div
                                key={personal.id}
                                className={cn(
                                  "flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                  yaSeleccionado && "bg-accent text-accent-foreground"
                                )}
                                onClick={() => {
                                  if (yaSeleccionado) {
                                    // Quitar de la selección
                                    setPersonalSeleccionado((prev) => prev.filter((p) => p.id !== personal.id));
                                  } else {
                                    // Abrir modal de configuración para todos los casos
                                    setFuncionarioAConfigurar(personal);
                                    setModalConfiguracionAbierto(true);
                                  }
                                  // Limpiar búsqueda después de cualquier acción
                                  setBusqueda("");
                                  setPersonalEncontrado([]);
                                  setBusquedaCompletada(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", yaSeleccionado ? "opacity-100" : "opacity-0")} />
                                <span className="text-sm">
                                  {personal.grado} {personal.nombreCompleto} - {personal.unidad}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {cargandoBusqueda && <p className="text-sm text-muted-foreground">Buscando...</p>}
                  </div>

                  {busqueda.length >= 2 && busquedaCompletada && personalEncontrado.length === 0 && !cargandoBusqueda && (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-2">No se encontraron funcionarios</p>
                      <Button type="button" variant="outline" onClick={() => setModalCrearAbierto(true)} disabled={cargando}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Crear Funcionario
                      </Button>
                    </div>
                  )}

                  {/* Funcionarios Seleccionados */}
                  {personalSeleccionado.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Funcionarios Seleccionados ({personalSeleccionado.length})</Label>
                      <div className="space-y-2 overflow-y-auto max-h-60">
                        {personalSeleccionado.map((personal) => (
                          <Card key={personal.id} className="p-3">
                            <CardContent className="p-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">{personal.grado.charAt(0)}</span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">
                                      {personal.grado} {personal.nombreCompleto}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">{personal.unidad}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge variant={personal.rolAtencion === RolAtencion.ENCARGADO ? "default" : "secondary"}>
                                        {personal.rolAtencion === RolAtencion.ENCARGADO ? "Encargado" : "Apoyo"}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">{TURNOS.find((t) => t.id === personal.turnoId)?.nombre}</span>
                                      {personal.ubicacion && (
                                        <span className="text-xs text-green-600 flex items-center">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          Ubicación
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setPersonalSeleccionado((prev) => prev.filter((p) => p.id !== personal.id))}
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => setAbierto(false)} disabled={cargando}>
              Cancelar
            </Button>
            <Button onClick={manejarAsignacion} disabled={cargando || personalSeleccionado.length === 0} className="min-w-[120px]">
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

      {/* Modal para crear funcionario */}
      <ModalCrearFuncionario
        abierto={modalCrearAbierto}
        onCerrar={() => setModalCrearAbierto(false)}
        onPersonalCreado={(personal) => {
          const funcionarioConConfig: FuncionarioConConfiguracion = {
            ...personal,
            rolAtencion: RolAtencion.APOYO,
            turnoId: "1",
          };
          setPersonalSeleccionado((prev) => [...prev, funcionarioConConfig]);
          setBusqueda(`${personal.grado} ${personal.nombreCompleto}`);
          setPersonalEncontrado([personal]);
        }}
      />

      {/* Modal para configurar funcionario */}
      <ModalDetalleFuncionario
        abierto={modalConfiguracionAbierto}
        onCerrar={() => {
          setModalConfiguracionAbierto(false);
          setFuncionarioAConfigurar(null);
        }}
        funcionario={funcionarioAConfigurar}
        turnos={TURNOS}
        onConfirmar={manejarConfiguracionFuncionario}
        cargando={cargando}
        personalSeleccionado={personalSeleccionado}
        idAtencion={idAtencion}
      />
    </>
  );
}
