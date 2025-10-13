"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { Personal } from "@/services/personalService";
import { usePersonal } from "@/hooks/personal/usePersonal";
import { ubicacionesService } from "@/services/ubicaciones/departamentosService";
import { Departamento } from "@/types/response/ubicaciones";

interface ModalEditarPersonalProps {
  personal: Personal | null;
  abierto: boolean;
  onCerrar: () => void;
  onActualizado: () => void;
}

export function ModalEditarPersonal({ personal, abierto, onCerrar, onActualizado }: ModalEditarPersonalProps) {
  const [grado, setGrado] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [unidad, setUnidad] = useState("");
  const [escalafon, setEscalafon] = useState("");
  const [idDepartamento, setIdDepartamento] = useState<number | "">("");
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [cargandoDepartamentos, setCargandoDepartamentos] = useState(false);
  const { actualizarPersonal, cargando } = usePersonal();

  useEffect(() => {
    const cargarDepartamentos = async () => {
      setCargandoDepartamentos(true);
      try {
        const respuesta = await ubicacionesService.obtenerDepartamentos();
        if (respuesta.exito && respuesta.datos) {
          setDepartamentos(respuesta.datos);
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      } finally {
        setCargandoDepartamentos(false);
      }
    };

    if (abierto) {
      cargarDepartamentos();
    }
  }, [abierto]);

  useEffect(() => {
    if (personal) {
      setGrado(personal.grado);
      setNombreCompleto(personal.nombreCompleto);
      setUnidad(personal.unidad);
      setEscalafon(personal.escalafon);
      setIdDepartamento(personal.idDepartamento);
    }
  }, [personal]);

  const manejarGuardar = async () => {
    if (!personal) return;

    const datosActualizar: Partial<{
      grado: string;
      nombreCompleto: string;
      unidad: string;
      escalafon: string;
      idDepartamento: number;
    }> = {};

    if (typeof grado === "string" && grado.trim() !== (personal.grado || "")) datosActualizar.grado = grado.trim();
    if (typeof nombreCompleto === "string" && nombreCompleto.trim() !== (personal.nombreCompleto || ""))
      datosActualizar.nombreCompleto = nombreCompleto.trim();
    if (typeof unidad === "string" && unidad.trim() !== (personal.unidad || "")) datosActualizar.unidad = unidad.trim();
    if (typeof escalafon === "string" && escalafon.trim() !== (personal.escalafon || "")) datosActualizar.escalafon = escalafon.trim();
    if (idDepartamento !== "" && idDepartamento !== personal.idDepartamento) datosActualizar.idDepartamento = idDepartamento as number;

    if (Object.keys(datosActualizar).length === 0) {
      onCerrar();
      return;
    }

    const resultado = await actualizarPersonal(personal.id, datosActualizar);
    if (resultado?.exito) {
      onActualizado();
      onCerrar();
    }
  };

  const manejarCerrar = () => {
    setGrado("");
    setNombreCompleto("");
    setUnidad("");
    setEscalafon("");
    setIdDepartamento("");
    onCerrar();
  };

  return (
    <Dialog open={abierto} onOpenChange={manejarCerrar}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Personal</DialogTitle>
          <DialogDescription>Modifique los datos del personal. Solo se enviarán los campos que cambien.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
            <Label htmlFor="unidad">Unidad</Label>
            <Input
              id="unidad"
              placeholder="ej: Unidad de Emergencias"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              disabled={cargando}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escalafon">Escalafón</Label>
            <Input id="escalafon" placeholder="ej: Oficial" value={escalafon} onChange={(e) => setEscalafon(e.target.value)} disabled={cargando} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idDepartamento">Departamento</Label>
            <Select
              value={idDepartamento.toString()}
              onValueChange={(value) => setIdDepartamento(value ? Number(value) : "")}
              disabled={cargando || cargandoDepartamentos}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar departamento" />
              </SelectTrigger>
              <SelectContent>
                {departamentos.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.departamento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={manejarCerrar} disabled={cargando}>
            Cancelar
          </Button>
          <Button onClick={manejarGuardar} disabled={cargando} className="min-w-[120px]">
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
