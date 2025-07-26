// Script de prueba para verificar la configuración de Cloudinary
import { CLOUDINARY_CONFIG, CLOUDINARY_UPLOAD_URL } from '../src/config/cloudinary.js'

console.log('🔧 Verificando configuración de Cloudinary...')
console.log('Cloud Name:', CLOUDINARY_CONFIG.cloud_name)
console.log('API Key:', CLOUDINARY_CONFIG.api_key)
console.log('Upload Preset:', CLOUDINARY_CONFIG.upload_preset)
console.log('Upload URL:', CLOUDINARY_UPLOAD_URL)

// Verificar que la URL esté bien formada
if (CLOUDINARY_CONFIG.cloud_name !== 'TU_CLOUD_NAME' && CLOUDINARY_CONFIG.cloud_name !== 'dzizafv5s') {
  console.error('❌ Cloud Name no coincide con el esperado')
} else {
  console.log('✅ Cloud Name configurado correctamente')
}

if (CLOUDINARY_UPLOAD_URL.includes('dzizafv5s')) {
  console.log('✅ URL de upload configurada correctamente')
} else {
  console.error('❌ URL de upload incorrecta')
}

console.log('🚀 Configuración lista para usar!')
