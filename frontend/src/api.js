import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

export const productosAPI = {
  getAll: (params) => api.get('/api/productos', { params }),
  getAllAdmin: () => api.get('/api/productos/admin'),
  getById: (id) => api.get(`/api/productos/${id}`),
  crear: (formData) => api.post('/api/productos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  editar: (id, formData) => api.put(`/api/productos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  eliminar: (id) => api.delete(`/api/productos/${id}`),
  eliminarImagen: (id, publicId) => api.delete(`/api/productos/${id}/imagen/${encodeURIComponent(publicId)}`),
  marcarPortada: (id, publicId) => api.patch(`/api/productos/${id}/portada/${encodeURIComponent(publicId)}`),
}

export const resenasAPI = {
  getAll: () => api.get('/api/resenas'),
  getAllAdmin: () => api.get('/api/resenas/admin'),
  crear: (data) => api.post('/api/resenas', data),
  aprobar: (id) => api.patch(`/api/resenas/${id}/aprobar`),
  eliminar: (id) => api.delete(`/api/resenas/${id}`),
}

export const visitasAPI = {
  registrar: (pagina) => api.post('/api/visitas', { pagina }),
  getStats: () => api.get('/api/visitas'),
  borrarTodo: () => api.delete('/api/visitas'),
}

export const configAPI = {
  get: () => api.get('/api/config'),
  update: (data) => api.put('/api/config', data),
}

export const heroImagenesAPI = {
  getAll: () => api.get('/api/hero-imagenes'),
  getAllAdmin: () => api.get('/api/hero-imagenes/admin'),
  subir: (formData) => api.post('/api/hero-imagenes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  editar: (id, data) => api.put(`/api/hero-imagenes/${id}`, data),
  eliminar: (id) => api.delete(`/api/hero-imagenes/${id}`),
}

export default api