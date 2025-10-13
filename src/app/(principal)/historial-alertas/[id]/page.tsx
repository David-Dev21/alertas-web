"use client";

import { useState, useEffect } from "react";
import { DetalleAlertaHistorial } from "../_components/DetalleAlertaHistorial";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HistorialAlertaDetallePage({ params }: PageProps) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };

    resolveParams();
  }, [params]);

  if (!id) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return <DetalleAlertaHistorial idAlerta={id} />;
}
