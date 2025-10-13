"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus } from "lucide-react";
import { usePersonal } from "@/hooks/personal/usePersonal";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";

interface ModalCrearFuncionarioProps {
  abierto: boolean;
  onCerrar: () => void;
  onPersonalCreado: (personal: any) => void;
}

export function ModalCrearFuncionario({ abierto, onCerrar, onPersonalCreado }: ModalCrearFuncionarioProps) {
  const [grado, setGrado] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [unidad, setUnidad] = useState("");
  const [escalafon, setEscalafon] = useState("");
  const datosUsuario = useAutenticacionStore((state) => state.datosUsuario);
  const { crearPersonal, cargando } = usePersonal();

  const manejarCrear = async () => {
    if (!datosUsuario?.ubicacion?.idDepartamento) {
      console.error("No hay departamento del usuario");
      return;
    }

    const datos = {
      grado: grado.trim(),
      nombreCompleto: nombreCompleto.trim(),
      unidad: unidad.trim(),
      escalafon: escalafon.trim(),
      idDepartamento: datosUsuario.ubicacion.idDepartamento,
    };

    const resultado = await crearPersonal(datos);
    if (resultado?.exito) {
      onPersonalCreado(resultado.datos);
      setGrado("");
      setNombreCompleto("");
      setUnidad("");
      setEscalafon("");
      onCerrar();
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Funcionario</DialogTitle>
          <DialogDescription>Complete los datos del nuevo funcionario para agregarlo al sistema.</DialogDescription>
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
            <Select value={escalafon} onValueChange={setEscalafon} disabled={cargando}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar escalafón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Oficial">Oficial</SelectItem>
                <SelectItem value="Suboficial">Suboficial</SelectItem>
                <SelectItem value="Tropa">Tropa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCerrar} disabled={cargando}>
            Cancelar
          </Button>
          <Button onClick={manejarCrear} disabled={cargando} className="min-w-[120px]">
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Crear
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
