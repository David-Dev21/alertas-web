import { useState, useEffect, useCallback } from "react";
import { agresorService, Agresor } from "@/services/agresores/agresorService";
import { EstadoCarga, RespuestaPaginada } from "@/types/common.types";

export interface EstadoAgresores extends EstadoCarga {
  agresores: Agresor[];
  paginacion: RespuestaPaginada<Agresor>["paginacion"];
}

export interface ParametrosConsultaAgresores {
  pagina?: number;
  limite?: number;
  busqueda?: string;
}

export function useAgresores() {
  const [estado, setEstado] = useState<EstadoAgresores>({
    agresores: [],
    paginacion: {
      paginaActual: 1,
      totalPaginas: 0,
      totalElementos: 0,
      elementosPorPagina: 10,
    },
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<ParametrosConsultaAgresores>({
    pagina: 1,
    limite: 10,
  });

  // Función para cargar agresores
  const cargarAgresores = useCallback(
    async (nuevosParametros?: Partial<ParametrosConsultaAgresores>) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));

        const parametrosFinales = { ...parametros, ...nuevosParametros };
        const respuesta = await agresorService.obtenerTodos(parametrosFinales);

        setEstado((previo) => ({
          ...previo,
          agresores: respuesta.datos || [],
          paginacion: respuesta.paginacion || {
            paginaActual: 1,
            totalPaginas: 0,
            totalElementos: 0,
            elementosPorPagina: 10,
          },
          cargando: false,
        }));

        if (nuevosParametros) {
          setParametros(parametrosFinales);
        }
      } catch (error) {
        console.error("Error al cargar agresores:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
      }
    },
    [parametros]
  );

  // Cargar agresores inicialmente
  useEffect(() => {
    cargarAgresores();
  }, [cargarAgresores]);

  // Función para refrescar los datos
  const refrescar = useCallback(() => {
    cargarAgresores();
  }, [cargarAgresores]);

  // Función para cambiar de página
  const irAPagina = useCallback(
    (nuevaPagina: number) => {
      cargarAgresores({ pagina: nuevaPagina });
    },
    [cargarAgresores]
  );

  // Función para cambiar el límite de elementos por página
  const cambiarLimite = useCallback(
    (nuevoLimite: number) => {
      cargarAgresores({ limite: nuevoLimite, pagina: 1 });
    },
    [cargarAgresores]
  );

  // Función para buscar
  const buscar = useCallback(
    (termino: string) => {
      cargarAgresores({ busqueda: termino, pagina: 1 });
    },
    [cargarAgresores]
  );

  return {
    ...estado,
    parametros,
    refrescar,
    irAPagina,
    cambiarLimite,
    buscar,
    cargarAgresores,
  };
}
