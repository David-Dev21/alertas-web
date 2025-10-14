import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { EstadoAlerta } from "@/types/enums";

// Configuración de colores para cada estado de alerta
const configuracionEstados = {
  PENDIENTE: {
    texto: "Pendiente",
    colores: {
      primario: "bg-red-500",
      fondo: "bg-red-100 dark:bg-red-900/20",
      texto: "text-red-800 dark:text-red-200",
      borde: "border-red-300 dark:border-red-700",
      hover: "hover:bg-red-200 dark:hover:bg-red-900/30",
      ring: "focus:ring-red-500/20 dark:focus:ring-red-400/40",
    },
  },
  ASIGNADA: {
    texto: "Asignada",
    colores: {
      primario: "bg-orange-500",
      fondo: "bg-orange-100 dark:bg-orange-900/20",
      texto: "text-orange-800 dark:text-orange-200",
      borde: "border-orange-300 dark:border-orange-700",
      hover: "hover:bg-orange-200 dark:hover:bg-orange-900/30",
      ring: "focus:ring-orange-500/20 dark:focus:ring-orange-400/40",
    },
  },
  EN_ATENCION: {
    texto: "En Atención",
    colores: {
      primario: "bg-yellow-500",
      fondo: "bg-yellow-100 dark:bg-yellow-900/20",
      texto: "text-yellow-800 dark:text-yellow-200",
      borde: "border-yellow-300 dark:border-yellow-700",
      hover: "hover:bg-yellow-200 dark:hover:bg-yellow-900/30",
      ring: "focus:ring-yellow-500/20 dark:focus:ring-yellow-400/40",
    },
  },
  RESUELTA: {
    texto: "Resuelta",
    colores: {
      primario: "bg-green-500",
      fondo: "bg-green-100 dark:bg-green-900/20",
      texto: "text-green-800 dark:text-green-200",
      borde: "border-green-300 dark:border-green-700",
      hover: "hover:bg-green-200 dark:hover:bg-green-900/30",
      ring: "focus:ring-green-500/20 dark:focus:ring-green-400/40",
    },
  },
  CANCELADA: {
    texto: "Cancelada",
    colores: {
      primario: "bg-red-500",
      fondo: "bg-red-100 dark:bg-red-900/20",
      texto: "text-red-800 dark:text-red-200",
      borde: "border-red-300 dark:border-red-700",
      hover: "hover:bg-red-200 dark:hover:bg-red-900/30",
      ring: "focus:ring-red-500/20 dark:focus:ring-red-400/40",
    },
  },
  FALSA_ALERTA: {
    texto: "Falsa Alerta",
    colores: {
      primario: "bg-gray-500",
      fondo: "bg-gray-100 dark:bg-gray-900/20",
      texto: "text-gray-800 dark:text-gray-200",
      borde: "border-gray-300 dark:border-gray-700",
      hover: "hover:bg-gray-200 dark:hover:bg-gray-900/30",
      ring: "focus:ring-gray-500/20 dark:focus:ring-gray-400/40",
    },
  },
} as const;

// Variantes específicas para AlertaBadge
const alertaBadgeVariants = cva(
  "inline-flex items-center justify-center font-bold border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      tamaño: {
        sm: "px-2 py-1 text-xs leading-none rounded-md",
        md: "px-3 py-1.5 text-sm leading-none rounded-md",
        lg: "px-4 py-2 text-base leading-none rounded-lg",
      },
      forma: {
        redonda: "rounded-full",
        rectangular: "rounded-md",
      },
    },
    defaultVariants: {
      tamaño: "md",
      forma: "redonda",
    },
  }
);

interface AlertaBadgeProps extends Omit<React.ComponentProps<"span">, "children">, VariantProps<typeof alertaBadgeVariants> {
  estado: string | EstadoAlerta;
  mostrarTexto?: boolean;
  asChild?: boolean;
}

function obtenerConfiguracionEstado(estado: string | EstadoAlerta) {
  const estadoNormalizado = typeof estado === "string" ? estado : String(estado);
  return configuracionEstados[estadoNormalizado as keyof typeof configuracionEstados] || configuracionEstados.PENDIENTE;
}

export function AlertaBadge({
  estado,
  tamaño = "md",
  forma = "redonda",
  mostrarTexto = true,
  className,
  asChild = false,
  ...props
}: AlertaBadgeProps) {
  const config = obtenerConfiguracionEstado(estado);

  const clases = cn(
    alertaBadgeVariants({ tamaño, forma }),
    config.colores.fondo,
    config.colores.texto,
    config.colores.borde,
    config.colores.hover,
    config.colores.ring,
    className
  );

  const Comp = asChild ? Slot : "span";

  if (!mostrarTexto) {
    return (
      <Comp className={clases} title={config.texto} aria-label={`Estado: ${config.texto}`} {...props}>
        <span className="sr-only">{config.texto}</span>
        <div className={cn("w-2 h-2 rounded-full", config.colores.primario)} />
      </Comp>
    );
  }

  return (
    <Comp className={clases} title={config.texto} aria-label={`Estado: ${config.texto}`} {...props}>
      {config.texto}
    </Comp>
  );
}

// Interfaces duplicadas de types para refactorización
// De alertas/Alerta.ts
// Enum movido a src/types/enums.ts

export { alertaBadgeVariants };
export type { AlertaBadgeProps };
