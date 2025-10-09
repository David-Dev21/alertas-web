"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BotonNuevaVictimaProps {
  onVictimaCreada: () => void;
}

export function BotonNuevaVictima({ onVictimaCreada }: BotonNuevaVictimaProps) {
  const manejarClick = () => {
    // TODO: Implementar modal o navegación para crear nueva víctima
    console.log("Crear nueva víctima");
    onVictimaCreada();
  };

  return (
    <Button onClick={manejarClick}>
      <Plus className="mr-2 h-4 w-4" />
      Nueva Víctima
    </Button>
  );
}
