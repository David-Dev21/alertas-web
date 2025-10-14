import { useState, useEffect, useCallback } from "react";
import { ubicacionesService, Departamento, Provincia, Municipio } from "@/services/ubicaciones/departamentosService";

export interface EstadoUbicaciones {
  departamentos: Departamento[];
  provincias: Provincia[];
  municipios: Municipio[];
  departamentoSeleccionado: number | null;
  provinciaSeleccionada: number | null;
  municipioSeleccionado: number | null;
  cargandoDepartamentos: boolean;
  cargandoProvincias: boolean;
  cargandoMunicipios: boolean;
  errorDepartamentos: string | null;
  errorProvincias: string | null;
  errorMunicipios: string | null;
}

export function useUbicacionesCascada() {
  const [estado, setEstado] = useState<EstadoUbicaciones>({
    departamentos: [],
    provincias: [],
    municipios: [],
    departamentoSeleccionado: null,
    provinciaSeleccionada: null,
    municipioSeleccionado: null,
    cargandoDepartamentos: false,
    cargandoProvincias: false,
    cargandoMunicipios: false,
    errorDepartamentos: null,
    errorProvincias: null,
    errorMunicipios: null,
  });

  // Cargar departamentos al inicializar
  const cargarDepartamentos = useCallback(async () => {
    try {
      setEstado((prev) => ({ ...prev, cargandoDepartamentos: true, errorDepartamentos: null }));
      const respuesta = await ubicacionesService.obtenerDepartamentos();
      setEstado((prev) => ({
        ...prev,
        departamentos: respuesta || [],
        cargandoDepartamentos: false,
      }));
    } catch (error) {
      console.error("Error cargando departamentos:", error);
      setEstado((prev) => ({
        ...prev,
        cargandoDepartamentos: false,
        errorDepartamentos: error instanceof Error ? error.message : "Error al cargar departamentos",
      }));
    }
  }, []);

  // Cargar provincias cuando se selecciona un departamento
  const cargarProvincias = useCallback(async (idDepartamento: number) => {
    try {
      setEstado((prev) => ({
        ...prev,
        cargandoProvincias: true,
        errorProvincias: null,
        provincias: [],
        municipios: [],
        provinciaSeleccionada: null,
        municipioSeleccionado: null,
      }));

      const respuesta = await ubicacionesService.obtenerProvinciasPorDepartamento(idDepartamento);
      setEstado((prev) => ({
        ...prev,
        provincias: respuesta || [],
        cargandoProvincias: false,
      }));
    } catch (error) {
      console.error("Error cargando provincias:", error);
      setEstado((prev) => ({
        ...prev,
        cargandoProvincias: false,
        errorProvincias: error instanceof Error ? error.message : "Error al cargar provincias",
      }));
    }
  }, []);

  // Cargar municipios cuando se selecciona una provincia
  const cargarMunicipios = useCallback(async (idProvincia: number) => {
    try {
      setEstado((prev) => ({
        ...prev,
        cargandoMunicipios: true,
        errorMunicipios: null,
        municipios: [],
        municipioSeleccionado: null,
      }));

      const respuesta = await ubicacionesService.obtenerMunicipiosPorProvincia(idProvincia);
      setEstado((prev) => ({
        ...prev,
        municipios: respuesta || [],
        cargandoMunicipios: false,
      }));
    } catch (error) {
      console.error("Error cargando municipios:", error);
      setEstado((prev) => ({
        ...prev,
        cargandoMunicipios: false,
        errorMunicipios: error instanceof Error ? error.message : "Error al cargar municipios",
      }));
    }
  }, []);

  // Seleccionar departamento
  const seleccionarDepartamento = useCallback(
    (idDepartamento: number | null) => {
      setEstado((prev) => ({
        ...prev,
        departamentoSeleccionado: idDepartamento,
        provinciaSeleccionada: null,
        municipioSeleccionado: null,
        provincias: [],
        municipios: [],
      }));

      if (idDepartamento) {
        cargarProvincias(idDepartamento);
      }
    },
    [cargarProvincias]
  );

  // Seleccionar provincia
  const seleccionarProvincia = useCallback(
    (idProvincia: number | null) => {
      setEstado((prev) => ({
        ...prev,
        provinciaSeleccionada: idProvincia,
        municipioSeleccionado: null,
        municipios: [],
      }));

      if (idProvincia) {
        cargarMunicipios(idProvincia);
      }
    },
    [cargarMunicipios]
  );

  // Seleccionar municipio
  const seleccionarMunicipio = useCallback((idMunicipio: number | null) => {
    setEstado((prev) => ({
      ...prev,
      municipioSeleccionado: idMunicipio,
    }));
  }, []);

  // Limpiar todas las selecciones
  const limpiarSelecciones = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      departamentoSeleccionado: null,
      provinciaSeleccionada: null,
      municipioSeleccionado: null,
      provincias: [],
      municipios: [],
    }));
  }, []);

  // Cargar departamentos al inicializar
  useEffect(() => {
    cargarDepartamentos();
  }, [cargarDepartamentos]);

  return {
    ...estado,
    seleccionarDepartamento,
    seleccionarProvincia,
    seleccionarMunicipio,
    limpiarSelecciones,
    recargarDepartamentos: cargarDepartamentos,
  };
}

export default useUbicacionesCascada;
