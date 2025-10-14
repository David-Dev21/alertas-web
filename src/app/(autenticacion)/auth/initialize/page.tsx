"use client";

import { Suspense } from "react";
import { InicializarContenido } from "./InicializarContenido";

export default function InicializaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto" />
            <p className="text-lg font-medium text-muted-foreground">Cargando...</p>
          </div>
        </div>
      }
    >
      <InicializarContenido />
    </Suspense>
  );
}
