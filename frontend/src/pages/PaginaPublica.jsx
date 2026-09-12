import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Catalogo from '../components/Catalogo'
import Resenas from '../components/Resenas'
import Contacto from '../components/Contacto'
import Footer from '../components/Footer'
import WhatsAppFlotante from '../components/WhatsAppFlotante'
import AnuncioFlotante from '../components/AnuncioFlotante'
import { useConfig } from '../hooks/useConfig'
import { visitasAPI } from '../api'

export default function PaginaPublica() {
  const { config, loading } = useConfig()

  useEffect(() => {
    visitasAPI.registrar(window.location.pathname).catch(() => {})
  }, [])

  const bannerActivo = config?.anuncio_activo && config?.anuncio_texto

  return (
    <div className={`min-h-screen ${bannerActivo ? 'pt-10' : ''}`}>
      <AnuncioFlotante config={config} />
      <Navbar />
      <Hero config={config} />
      <Catalogo config={config} />
      <Resenas />
      <Contacto config={config} />
      <Footer config={config} />
      <WhatsAppFlotante config={config} />
    </div>
  )
}
