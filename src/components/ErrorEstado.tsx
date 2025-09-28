'use client';

import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface Props {
  mensaje: string;
  onReintentar?: () => void;
  enlaceVolver?: string;
}

export function ErrorEstado({ mensaje, onReintentar, enlaceVolver = '/alertas-activas' }: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4 text-destructive" />
          <p className="mb-4 text-muted-foreground">{mensaje}</p>
          <div className="flex gap-2 justify-center">
            {onReintentar && (
              <Button onClick={onReintentar} variant="outline">
                Reintentar
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href={enlaceVolver}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
