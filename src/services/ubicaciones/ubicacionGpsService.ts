import baseApi from '../baseApi';

interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface DatosDepartamento {
  departamento: {
    id: number;
    departamento: string;
  };
}

// Obtener ubicación del navegador
export async function obtenerUbicacionActual(): Promise<Coordenadas> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        });
      },
      (error) => {
        let mensaje = 'Error al obtener ubicación';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensaje = 'Permiso de geolocalización denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            mensaje = 'Tiempo de espera agotado para obtener ubicación';
            break;
        }
        reject(new Error(mensaje));
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });
}

// Obtener departamento por coordenadas
export async function obtenerDepartamento(coordenadas: Coordenadas): Promise<DatosDepartamento> {
  const response = await baseApi.get('/departamentos/encontrar', {
    params: {
      latitud: coordenadas.latitud,
      longitud: coordenadas.longitud,
    },
  });

  return response.data.datos;
}
