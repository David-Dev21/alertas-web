import baseApi from '../baseApi';
import { RespuestaDepartamentos } from '@/types/ubicaciones/Departamento';
import { RespuestaProvincias } from '@/types/ubicaciones/Provincia';
import { RespuestaMunicipios } from '@/types/ubicaciones/Municipio';

class UbicacionesService {
  private readonly rutaBase = '/departamentos';

  /**
   * Obtiene todos los departamentos
   */
  async obtenerDepartamentos(): Promise<RespuestaDepartamentos> {
    const respuesta = await baseApi.get<RespuestaDepartamentos>(this.rutaBase);
    return respuesta.data;
  }

  /**
   * Obtiene las provincias de un departamento específico
   */
  async obtenerProvinciasPorDepartamento(idDepartamento: number): Promise<RespuestaProvincias> {
    const respuesta = await baseApi.get<RespuestaProvincias>(`${this.rutaBase}/${idDepartamento}/provincias`);
    return respuesta.data;
  }

  /**
   * Obtiene los municipios de una provincia específica
   */
  async obtenerMunicipiosPorProvincia(idProvincia: number): Promise<RespuestaMunicipios> {
    const respuesta = await baseApi.get<RespuestaMunicipios>(`${this.rutaBase}/provincias/${idProvincia}/municipios`);
    return respuesta.data;
  }
}

export const ubicacionesService = new UbicacionesService();
