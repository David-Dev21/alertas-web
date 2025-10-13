import axios, { AxiosError, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

const baseApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables para manejar refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];
let refreshTimeoutId: NodeJS.Timeout | null = null; // Para rastrear el timer activo

// Función para procesar la cola de peticiones fallidas
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Función para refrescar token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_KERBEROS_URL}/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const { access_token, refresh_token } = response.data;

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  return access_token;
};

// Función para iniciar timer de refresh automático
const startRefreshTimer = (token: string) => {
  // Limpiar timer anterior si existe
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    const refreshTime = Math.max((timeUntilExpiry - 300) * 1000, 0); // 5 minutos antes

    refreshTimeoutId = setTimeout(async () => {
      try {
        await refreshToken();
        const newToken = localStorage.getItem("access_token");
        if (newToken) {
          startRefreshTimer(newToken); // Reiniciar recursivamente
        }
      } catch (error) {
        console.error("Error en refresh automático:", error);
        localStorage.clear();
        window.location.href = "https://kerveros-dev.policia.bo";
      }
    }, refreshTime);
  } catch (error) {
    console.error("Error decodificando token:", error);
  }
};

baseApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Iniciar o reiniciar timer si no hay uno activo
      if (!refreshTimeoutId) {
        startRefreshTimer(token);
      }
    }
  }

  // Log de requests en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || {});
  }

  return config;
});
baseApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de responses en desarrollo
    if (process.env.NODE_ENV === "development") {
      // Si el backend indica error en el contenido, usar ese código
      const codigoLog = response.data && response.data.exito === false && response.data.codigo ? response.data.codigo : response.status;
      const emoji = response.data && response.data.exito === false ? "❌" : "✅";
      console.log(`${emoji} ${codigoLog} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      // Log del error si no hay config
      const mensaje = obtenerMensajeError(error);
      const codigo = error.response?.status || 500;
      const datos = error.response?.data;
      console.error(`❌ ${codigo}: ${mensaje}`, {
        url: error.config?.url,
        method: error.config?.method,
        datos,
      });
      throw error;
    }

    if (error.response?.status === 401 && !(originalRequest as any)._retry) {
      if (isRefreshing) {
        // Si ya está refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return baseApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      (originalRequest as any)._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Reiniciar timer con el nuevo token
        startRefreshTimer(newToken);
        processQueue(null, newToken);
        return baseApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "https://kerveros-dev.policia.bo";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Log del error
    const mensaje = obtenerMensajeError(error);
    const codigo = error.response?.status || 500;
    const datos = error.response?.data;
    console.error(`❌ ${codigo}: ${mensaje}`, {
      url: error.config?.url,
      method: error.config?.method,
      datos,
    });
    // Re-throw para que el código que llama lo maneje
    throw error;
  }
);

// Función helper para obtener mensaje de error
const obtenerMensajeError = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === "object" && "message" in error.response.data) {
    return (error.response.data as any).message;
  }
  return error.message || "Error desconocido";
};

export default baseApi;
