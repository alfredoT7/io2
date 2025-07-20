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
      LIST: '/api/productos',
      DETAIL: '/api/productos',
      CREATE: '/api/productos',
      UPDATE: '/api/productos',
      DELETE: '/api/productos'
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

// Función para hacer peticiones autenticadas
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(buildApiUrl(endpoint), config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Función específica para obtener productos
export const getProducts = async () => {
  try {
    const response = await fetch(buildApiUrl('/api/productos'));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
