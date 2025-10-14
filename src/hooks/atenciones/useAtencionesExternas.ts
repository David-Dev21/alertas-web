import { useState } from "react";
import { atencionesExternasService } from "@/services/atenciones/atencionesExternasService";
import { toast } from "sonner";
import { RolAtencion } from "@/types/enums";

// Interfaces duplicadas de types para refactorización
// De request/atenciones.ts
// Enum movido a src/types/enums.ts

interface FuncionarioExternoAtencion {
  rolAtencion: RolAtencion;
  ubicacion?: {
    longitud: number;
    latitud: number;
    precision: number;
    marcaTiempo: string;
  };
  turnoInicio: string;
  turnoFin: string;
  idPersonal: string;
}

interface AgregarFuncionarioExternoRequest {
  rolAtencion: RolAtencion;
  ubicacion?: {
    longitud: number;
    latitud: number;
    precision: number;
    marcaTiempo: string;
  };
  turnoInicio: string;
  turnoFin: string;
  idPersonal: string;
}

interface CrearAtencionExternaRequest {
  idAlerta: string;
  idUsuarioWeb: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioExternoAtencion[];
}

// De response/atenciones.ts
interface AtencionExternaResponse {
  exito: boolean;
  mensaje: string;
  datos?: unknown;
  error?: string;
}

export function useAtencionesExternas() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAtencionExterna = async (data: CrearAtencionExternaRequest): Promise<AtencionExternaResponse | null> => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await atencionesExternasService.crearAtencionExterna(data);
      toast.success(respuesta.mensaje);
      return respuesta;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } }; message?: string };
      const mensajeError = error.response?.data?.mensaje || error.message || "Error al asignar funcionario externo";
      setError(mensajeError);
      toast.error(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  const agregarFuncionarioExterno = async (idAtencion: string, data: AgregarFuncionarioExternoRequest): Promise<AtencionExternaResponse | null> => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await atencionesExternasService.agregarFuncionarioExterno(idAtencion, data);
      toast.success(respuesta.mensaje);
      return respuesta;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { mensaje?: string } }; message?: string };
      const mensajeError = error.response?.data?.mensaje || error.message || "Error al agregar funcionario externo";
      setError(mensajeError);
      toast.error(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return {
    crearAtencionExterna,
    agregarFuncionarioExterno,
    cargando,
    error,
  };
}
