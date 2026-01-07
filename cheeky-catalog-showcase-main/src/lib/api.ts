/**
 * Utilidades para llamadas API
 * Centraliza la configuración base y funciones comunes
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
}

/**
 * Realiza una llamada fetch con configuración centralizada
 */
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Headers por defecto - No incluir Content-Type para FormData
  const headers: HeadersInit = {
    ...(!(options.body instanceof FormData) && {
      'Content-Type': 'application/json',
    }),
    ...(options.headers as HeadersInit),
  };

  // Agregar token si existe
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      method: options.method || (options.body ? 'POST' : 'GET'),
      headers,
    });

    if (!response.ok) {
      // Intentar obtener mensaje de error del servidor
      let errorMessage = response.statusText;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no puede parsear JSON, usar el mensaje por defecto
      }

      // Manejar errores HTTP
      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('token');
        throw new Error(errorMessage || 'Sesión expirada. Por favor inicia sesión nuevamente.');
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Obtiene el token de autenticación
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Guarda el token de autenticación
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Elimina el token de autenticación
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

