import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

export const productosAPI = {
  getAll: (params) => api.get('/productos', { params }),
  getAllAdmin: () => api.get('/productos/admin'),
  getById: (id) => api.get(`/productos/${id}`),
  crear: (formData) => api.post('/productos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  editar: (id, formData) => api.put(`/productos/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  eliminar: (id) => api.delete(`/productos/${id}`),
  eliminarImagen: (id, publicId) => api.delete(`/productos/${id}/imagen/${encodeURIComponent(publicId)}`),
  marcarPortada: (id, publicId) => api.patch(`/productos/${id}/portada/${encodeURIComponent(publicId)}`),
}

export const resenasAPI = {
  getAll: () => api.get('/resenas'),
  getAllAdmin: () => api.get('/resenas/admin'),
  crear: (data) => api.post('/resenas', data),
  aprobar: (id) => api.patch(`/resenas/${id}/aprobar`),
  eliminar: (id) => api.delete(`/resenas/${id}`),
}

export const visitasAPI = {
  registrar: (pagina) => api.post('/visitas', { pagina }),
  getStats: () => api.get('/visitas'),
  borrarTodo: () => api.delete('/visitas'),
}

export const configAPI = {
  get: () => api.get('/config'),
  update: (data) => api.put('/config', data),
}

export const heroImagenesAPI = {
  getAll: () => api.get('/hero-imagenes'),
  getAllAdmin: () => api.get('/hero-imagenes/admin'),
  subir: (formData) => api.post('/hero-imagenes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  editar: (id, data) => api.put(`/hero-imagenes/${id}`, data),
  eliminar: (id) => api.delete(`/hero-imagenes/${id}`),
}

export default api
