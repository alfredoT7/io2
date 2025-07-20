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
      CREATE: '/api/compras',
      LIST: '/api/compras/usuario',
      DETAIL: '/api/compras'
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

// Función específica para crear una compra
export const createPurchase = async (purchaseData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(buildApiUrl('/api/compras'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(purchaseData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

// Función específica para obtener compras del usuario
export const getUserPurchases = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(buildApiUrl(`/api/compras/usuario/${userId}`), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    throw error;
  }
};

// Función específica para obtener productos
export const getProducts = async () => {
  try {
    const url = buildApiUrl('/api/productos');
    console.log('🔍 Fetching products from:', url);
    
    const response = await fetch(url);
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Products received:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    throw error;
  }
};
