"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalParentescoAgresorProps {
  abierto: boolean;
  onCerrar: () => void;
  agresor: {
    id: string;
    cedulaIdentidad: string;
    nombreCompleto: string;
  } | null;
  onConfirmar: (parentesco: string) => void;
  cargando?: boolean;
}

export function ModalParentescoAgresor({ abierto, onCerrar, agresor, onConfirmar, cargando = false }: ModalParentescoAgresorProps) {
  const [parentesco, setParentesco] = useState("");

  const manejarConfirmar = () => {
    if (parentesco.trim()) {
      onConfirmar(parentesco.trim());
      setParentesco("");
      onCerrar();
    }
  };

  const manejarCerrar = () => {
    setParentesco("");
    onCerrar();
  };

  return (
    <Dialog open={abierto} onOpenChange={manejarCerrar}>
      <DialogContent className="sm:max-w-md z-[10001] data-[state=open]:z-[10001]">
        <DialogHeader>
          <DialogTitle>Configurar Parentesco</DialogTitle>
        </DialogHeader>

        {agresor && (
          <div className="space-y-4">
            <div className="text-sm">
              <p>
                <strong>Agresor:</strong> {agresor.nombreCompleto}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentesco">Parentesco con la víctima</Label>
              <Input
                id="parentesco"
                value={parentesco}
                onChange={(e) => setParentesco(e.target.value)}
                placeholder="Ej: Padre, Madre, Pareja..."
                autoFocus
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={manejarCerrar} disabled={cargando}>
            Cancelar
          </Button>
          <Button onClick={manejarConfirmar} disabled={cargando || !parentesco.trim()}>
            Agregar Agresor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
