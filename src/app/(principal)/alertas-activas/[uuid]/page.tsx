'use client';

import { DetalleAlerta } from '../_components/DetalleAlerta';
import { useState, useEffect } from 'react';

interface PageProps {
  params: Promise<{ uuid: string }>;
}

export default function AlertaDetallePage({ params }: PageProps) {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setUuid(resolvedParams.uuid);
      } catch (error) {
        console.error('Error resolving params:', error);
      }
    };

    resolveParams();
  }, [params]);

  if (!uuid) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return <DetalleAlerta idAlerta={uuid} />;
}
