import api from '../baseApi';
import { CrearAtencionExternaRequest, AtencionExternaResponse, FuncionarioExternoAtencion } from '@/types/atenciones/Atencion';

class AtencionesExternasService {
  private readonly basePath = '/atenciones-externos';

  async crearAtencionExterna(data: CrearAtencionExternaRequest): Promise<AtencionExternaResponse> {
    try {
      const response = await api.post<AtencionExternaResponse>(this.basePath, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear atención externa:', error);
      throw error;
    }
  }

  async agregarFuncionarioExterno(idAtencion: string, data: Omit<FuncionarioExternoAtencion, 'id'>): Promise<AtencionExternaResponse> {
    try {
      const response = await api.post<AtencionExternaResponse>(`${this.basePath}/${idAtencion}/funcionarios-externos`, data);
      return response.data;
    } catch (error) {
      console.error('Error al agregar funcionario externo:', error);
      throw error;
    }
  }
}

export const atencionesExternasService = new AtencionesExternasService();
