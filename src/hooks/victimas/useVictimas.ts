import { useState, useEffect, useCallback } from "react";
import { victimasService } from "@/services/victimas/victimasService";
import { ParametrosConsultaVictimas } from "@/types/request/victimas";
import { Victima, RespuestaVictimas, PaginacionVictimas } from "@/types/response/victimas";

export interface EstadoVictimas {
  victimas: Victima[];
  paginacion: PaginacionVictimas;
  cargando: boolean;
  error: string | null;
}

export function useVictimas(parametrosIniciales: ParametrosConsultaVictimas = {}) {
  const [estado, setEstado] = useState<EstadoVictimas>({
    victimas: [],
    paginacion: {
      paginaActual: 1,
      totalPaginas: 0,
      totalElementos: 0,
      elementosPorPagina: 10,
    },
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<ParametrosConsultaVictimas>(parametrosIniciales);

  // Función para cargar víctimas
  const cargarVictimas = useCallback(
    async (nuevosParametros?: ParametrosConsultaVictimas) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));

        const parametrosFinales = { ...parametros, ...nuevosParametros };
        const respuesta = await victimasService.obtenerTodas(parametrosFinales);

        setEstado((previo) => ({
          ...previo,
          victimas: respuesta.datos?.victimas || [],
          paginacion: respuesta.datos?.paginacion || {
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
        console.error("Error al cargar víctimas:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
      }
    },
    [parametros]
  );

  // Cargar víctimas inicialmente
  useEffect(() => {
    cargarVictimas();
  }, []);

  // Función para refrescar los datos
  const refrescar = useCallback(() => {
    cargarVictimas();
  }, [cargarVictimas]);

  // Función para cambiar de página
  const irAPagina = useCallback(
    (nuevaPagina: number) => {
      cargarVictimas({ pagina: nuevaPagina });
    },
    [cargarVictimas]
  );

  // Función para cambiar el límite de elementos por página
  const cambiarLimite = useCallback(
    (nuevoLimite: number) => {
      cargarVictimas({ limite: nuevoLimite, pagina: 1 });
    },
    [cargarVictimas]
  );

  // Función para buscar
  const buscar = useCallback(
    (termino: string) => {
      cargarVictimas({ busqueda: termino, pagina: 1 });
    },
    [cargarVictimas]
  );

  // Función para aplicar filtros
  const aplicarFiltros = useCallback(
    (filtros: Omit<ParametrosConsultaVictimas, "pagina" | "limite">) => {
      cargarVictimas({ ...filtros, pagina: 1 });
    },
    [cargarVictimas]
  );

  // Función para limpiar filtros
  const limpiarFiltros = useCallback(() => {
    const parametrosLimpios = {
      pagina: 1,
      limite: parametros.limite || 10,
    };
    cargarVictimas(parametrosLimpios);
  }, [cargarVictimas, parametros.limite]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarVictimas();
  }, []);

  return {
    ...estado,
    parametros,
    refrescar,
    irAPagina,
    cambiarLimite,
    buscar,
    aplicarFiltros,
    limpiarFiltros,
    cargarVictimas,
  };
}
