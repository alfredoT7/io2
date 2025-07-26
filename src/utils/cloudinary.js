import { CLOUDINARY_CONFIG, CLOUDINARY_UPLOAD_URL } from '../config/cloudinary'

/**
 * Sube una imagen a Cloudinary usando el preset riee-consultorio
 * @param {File} file - El archivo de imagen a subir
 * @param {Object} options - Opciones adicionales para la subida
 * @returns {Promise<Object>} - Respuesta de Cloudinary con la URL de la imagen
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  try {
    const formData = new FormData()
    
    // Agregar el archivo
    formData.append('file', file)
    
    // Usar el preset riee-consultorio (unsigned)
    formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset)
    
    // Agregar folder si se especifica
    if (options.folder) {
      formData.append('folder', options.folder)
    }
    
    // Agregar tags si se especifican
    if (options.tags) {
      formData.append('tags', options.tags.join(','))
    }

    console.log('Uploading to Cloudinary with preset:', CLOUDINARY_CONFIG.upload_preset)

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData
    })

    console.log('Cloudinary response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cloudinary error response:', errorText)
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Cloudinary success response:', result)
    
    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      created_at: result.created_at,
      bytes: result.bytes
    }

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Valida el archivo antes de subirlo
 * @param {File} file - El archivo a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} - Resultado de la validación
 */
export const validateImageFile = (file, options = {}) => {
  const maxSize = options.maxSize || 5 * 1024 * 1024 // 5MB por defecto
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  
  const errors = []
  
  if (!file) {
    errors.push('No se ha seleccionado ningún archivo')
    return { isValid: false, errors }
  }
  
  if (file.size > maxSize) {
    errors.push(`El archivo es muy grande. Tamaño máximo: ${Math.round(maxSize / 1024 / 1024)}MB`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('Formato de archivo no válido. Use JPG, PNG, WebP o GIF')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}
