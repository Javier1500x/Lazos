import { useState, useEffect } from 'react'
import { configAPI } from '../api'

const DEFAULT_CONFIG = {
  nombre_negocio: 'Lazos',
  whatsapp: '85383864',
  whatsapp_mensaje: 'Hola, me interesa hacer un pedido de lazos',
  hero_titulo: 'Cada lazo, una historia',
  hero_subtitulo: 'Elaborados uno por uno con dedicación',
  hero_badge: 'Hecho a mano',
  mostrar_precios: true,
  anuncio_activo: true,
  anuncio_texto: '¡Envíos gratis esta semana! Haz tu pedido por WhatsApp',
}

export function useConfig() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    configAPI.get()
      .then(({ data }) => setConfig(data.data))
      .catch(() => setConfig(DEFAULT_CONFIG))
      .finally(() => setLoading(false))
  }, [])

  return { config, loading }
}
