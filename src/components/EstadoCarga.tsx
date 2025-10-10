'use client';

import { Loader2 } from 'lucide-react';

interface Props {
  mensaje?: string;
  tamaño?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loading({ mensaje = 'Cargando...', tamaño = 'md', className = '' }: Props) {
  const tamañoIcono = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex items-center justify-center h-64 ${className}`}>
      <div className="text-center space-y-4">
        <Loader2 className={`${tamañoIcono[tamaño]} animate-spin mx-auto`} />
        <p className="text-muted-foreground">{mensaje}</p>
      </div>
    </div>
  );
}
