import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ZoomIn, Ribbon } from 'lucide-react'
import { productosAPI } from '../api'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

// Ícono de lazo SVG cuando no hay imagen
function IconoLazo({ className = '' }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M32 20 C28 14 16 8 8 12 C2 15 2 25 8 28 C16 32 28 26 32 20Z" fill="#fce8f2" stroke="#f4a7c3" strokeWidth="1.5"/>
      <path d="M32 20 C36 14 48 8 56 12 C62 15 62 25 56 28 C48 32 36 26 32 20Z" fill="#fce8f2" stroke="#f4a7c3" strokeWidth="1.5"/>
      <circle cx="32" cy="20" r="4" fill="#f4a7c3"/>
    </svg>
  )
}

function TarjetaProducto({ producto, config, onVerFotos }) {
  const [imgActual, setImgActual] = useState(0)
  const imgs = producto.imagenes || []
  const portada = imgs.find((i) => i.esPortada) || imgs[0]

  const whatsappUrl = `https://wa.me/505${config?.whatsapp || '85383864'}?text=${encodeURIComponent(
    `Hola, me interesa el lazo "${producto.nombre}"`
  )}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-pink-50 group"
    >
      {/* Imagen */}
      <div className="relative overflow-hidden aspect-square bg-pink-50">
        {portada ? (
          <img
            src={portada.url}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconoLazo className="w-24 h-16 opacity-60" />
          </div>
        )}

        {/* Botón galería */}
        {imgs.length > 1 && (
          <button
            onClick={() => onVerFotos(imgs)}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
            aria-label="Ver galería"
          >
            <ZoomIn size={15} className="text-pink-400" />
          </button>
        )}

        {/* Dots de navegación si hay varias fotos */}
        {imgs.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((img, i) => (
              <button
                key={img.publicId}
                onClick={() => setImgActual(i)}
                className={`rounded-full transition-all ${
                  i === imgActual ? 'w-3 h-1.5 bg-pink-400' : 'w-1.5 h-1.5 bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-gray-800 text-base mb-1 truncate">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-sm text-gray-500 font-light line-clamp-2 mb-3">
            {producto.descripcion}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {config?.mostrar_precios !== false && (
            <span className="text-pink-500 font-semibold text-lg">
              C$ {producto.precio?.toFixed(2)}
            </span>
          )}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-white text-xs font-medium px-4 py-2 rounded-full transition-colors shadow-sm ml-auto"
          >
            <ShoppingBag size={13} />
            Pedir
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default function Catalogo({ config }) {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightboxSlides, setLightboxSlides] = useState([])
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    productosAPI
      .getAll()
      .then(({ data }) => setProductos(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const abrirLightbox = (imgs) => {
    setLightboxSlides(imgs.map((img) => ({ src: img.url })))
    setLightboxOpen(true)
  }

  return (
    <section id="catalogo" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-pink-400 text-sm font-medium tracking-widest uppercase mb-3">
            Colección
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-800 italic mb-4">
            Nuestros lazos
          </h2>
          <div className="w-16 h-0.5 bg-pink-300 mx-auto" />
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-pink-100 rounded-2xl mb-3" />
                <div className="h-4 bg-pink-100 rounded mb-2" />
                <div className="h-3 bg-pink-50 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-400"
          >
            <IconoLazo className="w-20 h-14 mx-auto mb-4 opacity-40" />
            <p className="font-light">No hay productos disponibles todavía</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {productos.map((producto) => (
                <TarjetaProducto
                  key={producto._id}
                  producto={producto}
                  config={config}
                  onVerFotos={abrirLightbox}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
      />
    </section>
  )
}
