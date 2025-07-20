// Configuración de la API
export const API_CONFIG = {
  BASE_URL: 'https://io2-back.vercel.app',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/registro',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout'
    },
    PRODUCTS: {
      LIST: '/api/products',
      DETAIL: '/api/products',
      CREATE: '/api/products',
      UPDATE: '/api/products',
      DELETE: '/api/products'
    },
    ORDERS: {
      CREATE: '/api/orders',
      LIST: '/api/orders',
      DETAIL: '/api/orders'
    }
  }
}

// Helper function para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Helper function para hacer requests con token
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(buildApiUrl(endpoint), config)
  
  // Si el token expiró, redirigir al login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/signin'
  }

  return response
}
