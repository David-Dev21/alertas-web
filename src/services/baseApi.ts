import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

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
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

// Función para procesar la cola de peticiones fallidas
const processQueue = (error: unknown, token: string | null = null) => {
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

baseApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Verificar si la respuesta tiene la estructura base
    if (response.data && typeof response.data === "object" && "exito" in response.data) {
      if (response.data.exito === true) {
        // Devolver solo los datos
        response.data = response.data.datos;
      } else {
        // Si exito es false, crear un error
        const apiError = new Error(response.data.mensaje || "Error en la respuesta del servidor");
        (apiError as Error & { response: AxiosResponse }).response = response;
        throw apiError;
      }
    }

    // Log de responses en desarrollo
    if (process.env.NODE_ENV === "development") {
      const emoji = "✅";
      console.log(`${emoji} ${response.status} ${response.config.url}`, response.data);
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

    if (error.response?.status === 401 && !(originalRequest as AxiosRequestConfig & { _retry?: boolean })._retry) {
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

      (originalRequest as AxiosRequestConfig & { _retry?: boolean })._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return baseApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "https://kerveros-dev.policia.bo/auth/login";
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
    return (error.response.data as { message: string }).message;
  }
  return error.message || "Error desconocido";
};

export default baseApi;
