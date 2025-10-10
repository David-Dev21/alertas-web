"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search } from "lucide-react";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";
import { alertasService } from "@/services/alertas/alertasService";
import { ModalAgregarAgresor } from "./ModalAgregarAgresor";
import { useAgresores } from "@/hooks/alertas/useAgresores";

interface ModalCerrarAlertaProps {
  abierto: boolean;
  onCerrar: () => void;
  idAlerta: string;
  onAlertaCerrada?: () => void;
}

interface DatosCierre {
  idUsuarioPanel: string;
  motivoCierre: "RESUELTA" | "FALSA_ALERTA";
  estadoVictima?: string;
  idAgresor?: string;
  observaciones: string;
  fechaHora: string;
}

interface DatosAgresor {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
}

interface AgresorEncontrado {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  parentesco: string;
}

export function ModalCerrarAlerta({ abierto, onCerrar, idAlerta, onAlertaCerrada }: ModalCerrarAlertaProps) {
  const { usuario } = useAuth();
  const { buscarAgresor: buscarAgresorHook, buscandoAgresor, creandoAgresor } = useAgresores();
  const [cargando, setCargando] = useState(false);
  const [pestañaActiva, setPestañaActiva] = useState("relevante");

  const [datos, setDatos] = useState<DatosCierre>({
    idUsuarioPanel: usuario.idUsuario || "",
    motivoCierre: "RESUELTA",
    estadoVictima: "",
    idAgresor: "",
    observaciones: "",
    fechaHora: new Date().toISOString(),
  });

  const [datosAgresor, setDatosAgresor] = useState<DatosAgresor>({
    cedulaIdentidad: "",
    nombres: "",
    apellidos: "",
    parentesco: "",
  });

  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [agresorEncontrado, setAgresorEncontrado] = useState<AgresorEncontrado | null>(null);
  const [mostrarCrearAgresor, setMostrarCrearAgresor] = useState(false);

  useEffect(() => {
    if (abierto) {
      // Resetear estados cuando se abre el modal
      setCedulaBusqueda("");
      setAgresorEncontrado(null);
      setMostrarCrearAgresor(false);
      setDatosAgresor({
        cedulaIdentidad: "",
        nombres: "",
        apellidos: "",
        parentesco: "",
      });
      setDatos((prev) => ({
        ...prev,
        idAgresor: "",
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

    const agresor = await buscarAgresorHook(cedulaBusqueda.trim());

    if (agresor) {
      setAgresorEncontrado(agresor);
      // Guardar el ID del agresor encontrado
      setDatos((prev) => ({
        ...prev,
        idAgresor: agresor.id,
      }));
      // Llenar datosAgresor con los datos encontrados
      const [nombres, ...apellidosArray] = agresor.nombreCompleto.split(" ");
      const apellidos = apellidosArray.join(" ");
      setDatosAgresor({
        cedulaIdentidad: agresor.cedulaIdentidad,
        nombres: nombres,
        apellidos: apellidos,
        parentesco: agresor.parentesco,
      });
    } else {
      // No se encontró, mostrar modal de crear
      setMostrarCrearAgresor(true);
    }
  };

  const manejarAgresorCreado = (datosNuevoAgresor: {
    id: string;
    cedulaIdentidad: string;
    nombres: string;
    apellidos: string;
    parentesco: string;
  }) => {
    setDatos((prev) => ({
      ...prev,
      idAgresor: datosNuevoAgresor.id,
    }));
    setDatosAgresor({
      cedulaIdentidad: datosNuevoAgresor.cedulaIdentidad,
      nombres: datosNuevoAgresor.nombres,
      apellidos: datosNuevoAgresor.apellidos,
      parentesco: datosNuevoAgresor.parentesco,
    });
    setMostrarCrearAgresor(false);
    setAgresorEncontrado({
      id: datosNuevoAgresor.id,
      cedulaIdentidad: datosNuevoAgresor.cedulaIdentidad,
      nombreCompleto: `${datosNuevoAgresor.nombres} ${datosNuevoAgresor.apellidos}`,
      parentesco: datosNuevoAgresor.parentesco,
    });
  };

  const manejarSubmit = async () => {
    setCargando(true);
    try {
      const datosEnvio: DatosCierre = {
        idUsuarioPanel: datos.idUsuarioPanel,
        motivoCierre: datos.motivoCierre,
        observaciones: datos.observaciones,
        fechaHora: datos.fechaHora,
      };

      // Solo incluir estadoVictima para casos RESUELTA
      if (pestañaActiva === "relevante") {
        datosEnvio.estadoVictima = datos.estadoVictima;
      }

      // Incluir idAgresor solo si se completó
      if (pestañaActiva === "relevante" && datos.idAgresor?.trim()) {
        datosEnvio.idAgresor = datos.idAgresor.trim();
      }

      console.log("Datos a enviar:", datosEnvio);
      await alertasService.cerrar(idAlerta, datosEnvio);

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

    // Para caso relevante, estadoVictima es requerido
    if (pestañaActiva === "relevante" && !datos.estadoVictima?.trim()) {
      return false;
    }

    // Para caso relevante, si hay datos del agresor (encontrado o manual), validar que haya idAgresor
    if (pestañaActiva === "relevante" && (agresorEncontrado || datosAgresor.cedulaIdentidad.trim())) {
      if (!datos.idAgresor?.trim()) {
        return false;
      }
    }

    return true;
  };

  return (
    <>
      <Dialog open={abierto} onOpenChange={onCerrar}>
        <DialogContent className="sm:max-w-[700px] z-[10000] data-[state=open]:z-[10000]">
          <DialogHeader>
            <DialogTitle>Cerrar Alerta</DialogTitle>
            <DialogDescription>Complete los datos para cerrar la alerta. Seleccione el tipo de cierre apropiado.</DialogDescription>
          </DialogHeader>

          <Tabs value={pestañaActiva} onValueChange={manejarCambioPestaña} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="relevante">Relevante</TabsTrigger>
              <TabsTrigger value="falsa-alarma">Falsa Alarma</TabsTrigger>
            </TabsList>

            <TabsContent value="relevante" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado-victima">Estado de la Víctima</Label>
                  <Input
                    id="estado-victima"
                    value={datos.estadoVictima}
                    onChange={(e) => manejarCambio("estadoVictima", e.target.value)}
                    placeholder="Ej: Segura, En riesgo, Desaparecida..."
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
                      <Label htmlFor="busqueda-cedula">Cédula de Identidad</Label>
                      <Input
                        id="busqueda-cedula"
                        value={cedulaBusqueda}
                        onChange={(e) => setCedulaBusqueda(e.target.value)}
                        placeholder="Ingrese cédula para buscar"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" onClick={buscarAgresor} disabled={buscandoAgresor || !cedulaBusqueda.trim()} size="sm">
                        {buscandoAgresor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Buscar
                      </Button>
                    </div>
                  </div>

                  {agresorEncontrado && (
                    <div className="border rounded-md p-3 bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm">
                          <span>
                            <strong>Cédula:</strong> {agresorEncontrado.cedulaIdentidad}
                          </span>
                          <span>
                            <strong>Nombre:</strong> {agresorEncontrado.nombreCompleto}
                          </span>
                          <span>
                            <strong>Parentesco:</strong> {agresorEncontrado.parentesco}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAgresorEncontrado(null);
                            setCedulaBusqueda("");
                            setMostrarCrearAgresor(false);
                            setDatosAgresor({
                              cedulaIdentidad: "",
                              nombres: "",
                              apellidos: "",
                              parentesco: "",
                            });
                            setDatos((prev) => ({
                              ...prev,
                              idAgresor: "",
                            }));
                          }}
                        >
                          Cambiar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="falsa-alarma" className="space-y-4 mt-4">
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
          </Tabs>

          <DialogFooter>
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
        idAlerta={idAlerta}
        cedulaInicial={cedulaBusqueda}
        onAgresorCreado={manejarAgresorCreado}
      />
    </>
  );
}
