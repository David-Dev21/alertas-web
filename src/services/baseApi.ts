import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// Clase personalizada para errores de API
export class ErrorApi extends Error {
  public codigo: number;
  public mensaje: string;
  public datos?: any;

  constructor(codigo: number, mensaje: string, datos?: any) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.codigo = codigo;
    this.mensaje = mensaje;
    this.datos = datos;
  }
}

// Configuración de la API base (se lee una sola vez)
const configuracionApi = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '100000'),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// Crear instancia de Axios centralizada
const apiBase: AxiosInstance = axios.create(configuracionApi);

// Interceptor de request - para agregar token de autenticación si existe
apiBase.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage si existe
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token-autenticacion');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log de requests en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  },
);

// Interceptor de response - para manejo centralizado de errores
apiBase.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de responses exitosas en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API Response] ${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error: AxiosError) => {
    const mensaje = obtenerMensajeError(error);
    const codigo = error.response?.status || 500;
    const datos = error.response?.data;

    // Log del error
    console.error(`❌ [API Error] ${codigo}:`, mensaje, {
      url: error.config?.url,
      method: error.config?.method,
      datos,
    });

    // Manejo específico de errores de autenticación
    if (codigo === 401) {
      // Limpiar token inválido
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token-autenticacion');
      }

      // Redireccionar a login si no estamos ya en una página de auth
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
        window.location.href = '/auth/initialize';
      }
    }

    // Crear error personalizado
    const errorApi = new ErrorApi(codigo, mensaje, datos);
    return Promise.reject(errorApi);
  },
);

// Función auxiliar para obtener mensaje de error legible
function obtenerMensajeError(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any;

    // Diferentes formatos de error del backend
    if (typeof data === 'string') {
      return data;
    }

    if (data.message) {
      return data.message;
    }

    if (data.mensaje) {
      return data.mensaje;
    }

    if (data.error) {
      return typeof data.error === 'string' ? data.error : data.error.message;
    }
  }

  // Mensajes por códigos de estado
  switch (error.response?.status) {
    case 400:
      return 'Solicitud incorrecta. Verifique los datos enviados.';
    case 401:
      return 'No está autorizado. Inicie sesión nuevamente.';
    case 403:
      return 'No tiene permisos para realizar esta acción.';
    case 404:
      return 'Recurso no encontrado.';
    case 408:
      return 'Tiempo de espera agotado. Intente nuevamente.';
    case 422:
      return 'Datos de entrada inválidos.';
    case 500:
      return 'Error interno del servidor. Contacte al administrador.';
    case 502:
      return 'Error de conexión con el servidor.';
    case 503:
      return 'Servicio no disponible. Intente más tarde.';
    default:
      return error.message || 'Error desconocido en la comunicación con el servidor.';
  }
}

// Función para obtener información de configuración (útil para debugging)
export function obtenerConfiguracionApi() {
  return {
    baseURL: configuracionApi.baseURL,
    timeout: configuracionApi.timeout,
    entorno: process.env.NODE_ENV,
  };
}

// Exportar instancia configurada para uso en servicios
export default apiBase;

// Exportar tipos útiles
export type { AxiosResponse, AxiosError };
