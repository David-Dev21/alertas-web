"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, X } from "lucide-react";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";
import { agresorService } from "@/services/agresores/agresorService";
import { ModalAgregarAgresor } from "./ModalAgregarAgresor";
import { ModalParentescoAgresor } from "./ModalParentescoAgresor";

interface ModalCerrarAlertaProps {
  abierto: boolean;
  onCerrar: () => void;
  idAlerta: string;
  onAlertaCerrada?: () => void;
}

interface DatosCierre {
  idUsuarioWeb: string;
  motivoCierre: "RESUELTA" | "FALSA_ALERTA";
  estadoVictima?: string;
  agresores?: { idAgresor: string; parentesco: string }[];
  observaciones: string;
  fechaHora: string;
}

interface AgresorSeleccionado {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  parentesco: string;
}

export function ModalCerrarAlerta({ abierto, onCerrar, idAlerta, onAlertaCerrada }: ModalCerrarAlertaProps) {
  const { usuario } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState("relevante");
  const [buscando, setBuscando] = useState(false);

  const [datos, setDatos] = useState<DatosCierre>({
    idUsuarioWeb: usuario.idUsuario || "",
    motivoCierre: "RESUELTA",
    estadoVictima: "",
    agresores: [],
    observaciones: "",
    fechaHora: new Date().toISOString(),
  });

  const [agresoresSeleccionados, setAgresoresSeleccionados] = useState<AgresorSeleccionado[]>([]);

  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [mostrarCrearAgresor, setMostrarCrearAgresor] = useState(false);
  const [modalParentescoAbierto, setModalParentescoAbierto] = useState(false);
  const [agresorParaParentesco, setAgresorParaParentesco] = useState<{ id: string; cedulaIdentidad: string; nombreCompleto: string } | null>(null);

  useEffect(() => {
    if (abierto) {
      // Resetear estados cuando se abre el modal
      setCedulaBusqueda("");
      setAgresoresSeleccionados([]);
      setMostrarCrearAgresor(false);
      setModalParentescoAbierto(false);
      setAgresorParaParentesco(null);
      setDatos((prev) => ({
        ...prev,
        estadoVictima: "",
        agresores: [],
        observaciones: "",
      }));
    }
  }, [abierto]);

  const manejarCambioPestaña = (pestaña: string) => {
    setPestañaActiva(pestaña);
    setDatos((prev) => ({
      ...prev,
      motivoCierre: pestaña === "relevante" ? "RESUELTA" : "FALSA_ALERTA",
    }));
  };

  const manejarCambio = (campo: keyof DatosCierre, valor: string) => {
    setDatos((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const buscarAgresor = async () => {
    if (!cedulaBusqueda.trim()) return;

    setBuscando(true);
    try {
      const agresor = await agresorService.buscarPorCedula(cedulaBusqueda.trim());

      if (agresor) {
        // Abrir modal para configurar parentesco
        setAgresorParaParentesco(agresor);
        setModalParentescoAbierto(true);
        setCedulaBusqueda("");
      } else {
        // No se encontró, mostrar modal de crear
        setMostrarCrearAgresor(true);
      }
    } catch (error) {
      console.error("Error buscando agresor:", error);
    } finally {
      setBuscando(false);
    }
  };

  const manejarAgresorCreado = (datosNuevoAgresor: { id: string; cedulaIdentidad: string; nombres: string; apellidos: string }) => {
    const agresor = {
      id: datosNuevoAgresor.id,
      cedulaIdentidad: datosNuevoAgresor.cedulaIdentidad,
      nombreCompleto: `${datosNuevoAgresor.nombres} ${datosNuevoAgresor.apellidos}`,
    };
    setAgresorParaParentesco(agresor);
    setModalParentescoAbierto(true);
    setMostrarCrearAgresor(false);
    setCedulaBusqueda("");
  };

  const removerAgresor = (index: number) => {
    setAgresoresSeleccionados((prev) => prev.filter((_, i) => i !== index));
  };

  const manejarParentescoConfirmado = (parentesco: string) => {
    if (agresorParaParentesco) {
      const nuevoAgresor: AgresorSeleccionado = {
        id: agresorParaParentesco.id,
        cedulaIdentidad: agresorParaParentesco.cedulaIdentidad,
        nombreCompleto: agresorParaParentesco.nombreCompleto,
        parentesco: parentesco,
      };
      setAgresoresSeleccionados((prev) => [...prev, nuevoAgresor]);
      setAgresorParaParentesco(null);
    }
  };

  const manejarSubmit = async () => {
    setCargando(true);
    try {
      const datosEnvio: DatosCierre = {
        idUsuarioWeb: datos.idUsuarioWeb,
        motivoCierre: datos.motivoCierre,
        observaciones: datos.observaciones,
        fechaHora: datos.fechaHora,
      };

      // Solo incluir estadoVictima para casos RESUELTA
      if (pestañaActiva === "relevante") {
        if (datos.estadoVictima?.trim()) {
          datosEnvio.estadoVictima = datos.estadoVictima.trim();
        }
      }

      // Incluir agresores si hay alguno seleccionado
      if (agresoresSeleccionados.length > 0) {
        datosEnvio.agresores = agresoresSeleccionados.map((a) => ({
          idAgresor: a.id,
          parentesco: a.parentesco.trim(),
        }));
      }

      console.log("Datos a enviar:", datosEnvio);
      await agresorService.cerrarAlerta(idAlerta, datosEnvio);

      onAlertaCerrada?.();
      onCerrar();
    } catch (error) {
      console.error("Error al cerrar alerta:", error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setCargando(false);
    }
  };

  const puedeEnviar = () => {
    // Observaciones siempre son requeridas
    if (!datos.observaciones.trim()) {
      return false;
    }

    // Para caso relevante, estadoVictima es opcional, agresores opcionales
    return true;
  };

  return (
    <>
      <Dialog open={abierto} onOpenChange={onCerrar}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col z-[10000] data-[state=open]:z-[10000]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Cerrar Alerta</DialogTitle>
            <DialogDescription>Complete los datos para cerrar la alerta. Seleccione el tipo de cierre apropiado.</DialogDescription>
          </DialogHeader>

          <Tabs value={pestañaActiva} onValueChange={manejarCambioPestaña} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="relevante">Relevante</TabsTrigger>
              <TabsTrigger value="falsa-alarma">Falsa Alarma</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <TabsContent value="relevante" className="space-y-4 mt-0">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="estado-victima">Estado de la Víctima</Label>
                      <Input
                        id="estado-victima"
                        value={datos.estadoVictima}
                        onChange={(e) => manejarCambio("estadoVictima", e.target.value)}
                        placeholder="Ej: Segura"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="observaciones-relevante">Observaciones *</Label>
                      <Textarea
                        id="observaciones-relevante"
                        value={datos.observaciones}
                        onChange={(e) => manejarCambio("observaciones", e.target.value)}
                        placeholder="Describa las acciones realizadas y el resultado..."
                        rows={3}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">Información del Agresor (Opcional)</h4>
                      <p className="text-xs text-muted-foreground mb-4">Busque al agresor por cédula de identidad. Si no existe, podrá crearlo.</p>

                      <div className="flex gap-2 mb-4">
                        <div className="flex-1">
                          <Label htmlFor="busqueda-cedula" className="mb-2">
                            Cédula de Identidad
                          </Label>
                          <Input
                            id="busqueda-cedula"
                            value={cedulaBusqueda}
                            onChange={(e) => setCedulaBusqueda(e.target.value)}
                            placeholder="Ingrese cédula para buscar"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button type="button" onClick={buscarAgresor} disabled={buscando || !cedulaBusqueda.trim()} size="sm">
                            {buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            Buscar
                          </Button>
                        </div>
                      </div>

                      {agresoresSeleccionados.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Agresores Seleccionados ({agresoresSeleccionados.length})</Label>
                          <div className="space-y-2">
                            {agresoresSeleccionados.map((agresor, index) => (
                              <div key={agresor.id} className="border rounded-lg p-4 bg-card">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-sm font-medium text-primary">{agresor.nombreCompleto.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground">{agresor.nombreCompleto}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        CI: {agresor.cedulaIdentidad} • Parentesco: {agresor.parentesco}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removerAgresor(index)}
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="falsa-alarma" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="observaciones-falsa">Observaciones *</Label>
                    <Textarea
                      id="observaciones-falsa"
                      value={datos.observaciones}
                      onChange={(e) => manejarCambio("observaciones", e.target.value)}
                      placeholder="Explique por qué se considera falsa alarma..."
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button type="button" onClick={manejarSubmit} disabled={cargando || !puedeEnviar()}>
              {cargando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando...
                </>
              ) : (
                "Cerrar Alerta"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ModalAgregarAgresor
        abierto={mostrarCrearAgresor}
        onCerrar={() => setMostrarCrearAgresor(false)}
        cedulaInicial={cedulaBusqueda}
        onAgresorCreado={manejarAgresorCreado}
      />

      <ModalParentescoAgresor
        abierto={modalParentescoAbierto}
        onCerrar={() => {
          setModalParentescoAbierto(false);
          setAgresorParaParentesco(null);
        }}
        agresor={agresorParaParentesco}
        onConfirmar={manejarParentescoConfirmado}
      />
    </>
  );
}
