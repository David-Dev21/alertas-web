import { useState } from "react";
import { atencionesExternasService } from "@/services/atenciones/atencionesExternasService";
import { CrearAtencionExternaRequest, FuncionarioExternoAtencion, AgregarFuncionarioExternoRequest } from "@/types/request/atenciones";
import { AtencionExternaResponse } from "@/types/response/atenciones";
import { toast } from "sonner";

export function useAtencionesExternas() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearAtencionExterna = async (data: CrearAtencionExternaRequest): Promise<AtencionExternaResponse | null> => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await atencionesExternasService.crearAtencionExterna(data);
      toast.success(respuesta.mensaje || "Operación realizada exitosamente");
      return respuesta;
    } catch (err: any) {
      const mensajeError = err?.response?.data?.mensaje || err?.message || "Error al asignar funcionario externo";
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
      toast.success(respuesta.mensaje || "Funcionario agregado exitosamente");
      return respuesta;
    } catch (err: any) {
      const mensajeError = err?.response?.data?.mensaje || err?.message || "Error al agregar funcionario externo";
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
