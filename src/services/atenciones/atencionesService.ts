import api from '../baseApi';
import { CrearAtencionRequest, AtencionResponse } from '@/types/atenciones/Atencion';

class AtencionesService {
  private readonly basePath = '/atenciones';

  async crearAtencion(data: CrearAtencionRequest): Promise<AtencionResponse> {
    try {
      const response = await api.post<AtencionResponse>(this.basePath, data);
      return response.data;
    } catch (error) {
      console.error('Error al crear atención:', error);
      throw error;
    }
  }
}

export const atencionesService = new AtencionesService();
