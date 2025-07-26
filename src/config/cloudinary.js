// Configuración de Cloudinary
export const CLOUDINARY_CONFIG = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dzizafv5s',
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || '379764767797913',
  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'riee-consultorio'
}

// URL base para uploads
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`

// Función para crear transformaciones de imagen
export const getImageTransformations = (options = {}) => {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    width: 800,
    height: 600,
    crop: 'fill'
  }
  
  return { ...defaultTransformations, ...options }
}

// Función para validar la configuración
export const validateCloudinaryConfig = () => {
  if (!CLOUDINARY_CONFIG.cloud_name || CLOUDINARY_CONFIG.cloud_name === 'TU_CLOUD_NAME') {
    console.warn('⚠️ Cloudinary Cloud Name no configurado correctamente')
    return false
  }
  
  console.log('✅ Cloudinary configurado correctamente:', {
    cloud_name: CLOUDINARY_CONFIG.cloud_name,
    upload_url: CLOUDINARY_UPLOAD_URL
  })
  
  return true
}
