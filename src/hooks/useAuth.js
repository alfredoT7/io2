import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar si hay sesión al cargar
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('usuario')

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser)
        
        // Verificar que el token no haya expirado (opcional)
        if (isTokenValid(storedToken)) {
          setToken(storedToken)
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          logout()
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const isTokenValid = (token) => {
    try {
      // Decodificar JWT básico para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch {
      return false
    }
  }

  const login = (userData, authToken) => {
    try {
      localStorage.setItem('token', authToken)
      localStorage.setItem('usuario', JSON.stringify(userData))
      setToken(authToken)
      setUser(userData)
      setIsAuthenticated(true)
      
      toast.success(`¡Bienvenido ${userData.nombreCompleto}!`, {
        description: `Sesión iniciada como ${userData.tipoUsuario}`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Error al guardar datos de sesión:', error)
      toast.error('Error al iniciar sesión')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const register = () => {
    toast.success('Registro exitoso!', {
      description: 'Ahora puedes iniciar sesión con tu cuenta',
      duration: 3000,
    })
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    checkAuthStatus
  }
}
