import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUbicacionesCascada from '@/hooks/ubicaciones/useUbicacionesCascada';

interface FiltrosUbicacionProps {
  onCambioUbicacion?: (filtros: { idDepartamento?: number | null; idProvincia?: number | null; idMunicipio?: number | null }) => void;
  deshabilitado?: boolean;
  valoresIniciales?: {
    departamento?: number;
    provincia?: number;
    municipio?: number;
  };
  resetear?: boolean; // Nueva prop para resetear los filtros
}

export function FiltrosUbicacion({ onCambioUbicacion, deshabilitado = false, valoresIniciales, resetear }: FiltrosUbicacionProps) {
  const {
    departamentos,
    provincias,
    municipios,
    departamentoSeleccionado,
    provinciaSeleccionada,
    municipioSeleccionado,
    cargandoDepartamentos,
    cargandoProvincias,
    cargandoMunicipios,
    seleccionarDepartamento,
    seleccionarProvincia,
    seleccionarMunicipio,
    limpiarSelecciones,
  } = useUbicacionesCascada();

  // useEffect para resetear cuando cambie la prop resetear
  React.useEffect(() => {
    if (resetear) {
      limpiarSelecciones();
    }
  }, [resetear, limpiarSelecciones]);

  // Aplicar valores iniciales si se proporcionan
  React.useEffect(() => {
    if (valoresIniciales?.departamento && !departamentoSeleccionado) {
      seleccionarDepartamento(valoresIniciales.departamento);
    }
  }, [valoresIniciales?.departamento, departamentoSeleccionado, seleccionarDepartamento]);

  React.useEffect(() => {
    if (valoresIniciales?.provincia && !provinciaSeleccionada && provincias.length > 0) {
      seleccionarProvincia(valoresIniciales.provincia);
    }
  }, [valoresIniciales?.provincia, provinciaSeleccionada, provincias.length, seleccionarProvincia]);

  React.useEffect(() => {
    if (valoresIniciales?.municipio && !municipioSeleccionado && municipios.length > 0) {
      seleccionarMunicipio(valoresIniciales.municipio);
    }
  }, [valoresIniciales?.municipio, municipioSeleccionado, municipios.length, seleccionarMunicipio]);

  const manejarCambioDepartamento = (valor: string) => {
    const idDepartamento = valor === 'TODOS' ? null : Number(valor);
    seleccionarDepartamento(idDepartamento);
    // Al cambiar departamento, resetear provincia y municipio
    onCambioUbicacion?.({
      idDepartamento,
      idProvincia: null,
      idMunicipio: null,
    });
  };

  const manejarCambioProvincia = (valor: string) => {
    const idProvincia = valor === 'TODOS' ? null : Number(valor);
    seleccionarProvincia(idProvincia);
    // Al cambiar provincia, resetear municipio pero mantener departamento
    onCambioUbicacion?.({
      idDepartamento: departamentoSeleccionado,
      idProvincia,
      idMunicipio: null,
    });
  };

  const manejarCambioMunicipio = (valor: string) => {
    const idMunicipio = valor === 'TODOS' ? null : Number(valor);
    seleccionarMunicipio(idMunicipio);
    // Mantener departamento y provincia al cambiar municipio
    onCambioUbicacion?.({
      idDepartamento: departamentoSeleccionado,
      idProvincia: provinciaSeleccionada,
      idMunicipio,
    });
  };

  return (
    <div className="flex gap-2">
      {/* Select Departamento */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Departamento:</label>
        <Select
          value={departamentoSeleccionado?.toString() || 'TODOS'}
          onValueChange={manejarCambioDepartamento}
          disabled={deshabilitado || cargandoDepartamentos}
        >
          <SelectTrigger className="min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[10000]">
            <SelectItem value="TODOS">Todos</SelectItem>
            {departamentos.map((depto) => (
              <SelectItem key={depto.id} value={depto.id.toString()}>
                {depto.departamento}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Select Provincia */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Provincia:</label>
        <Select
          value={provinciaSeleccionada?.toString() || 'TODOS'}
          onValueChange={manejarCambioProvincia}
          disabled={deshabilitado || !departamentoSeleccionado || cargandoProvincias}
        >
          <SelectTrigger className="min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[10000]">
            <SelectItem value="TODOS">Todas</SelectItem>
            {provincias.map((prov) => (
              <SelectItem key={prov.id} value={prov.id.toString()}>
                {prov.provincia}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Select Municipio */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Municipio:</label>
        <Select
          value={municipioSeleccionado?.toString() || 'TODOS'}
          onValueChange={manejarCambioMunicipio}
          disabled={deshabilitado || !provinciaSeleccionada || cargandoMunicipios}
        >
          <SelectTrigger className="min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[10000]">
            <SelectItem value="TODOS">Todos</SelectItem>
            {municipios.map((mun) => (
              <SelectItem key={mun.id} value={mun.id.toString()}>
                {mun.municipio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
