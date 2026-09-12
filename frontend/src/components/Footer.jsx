import { motion } from 'framer-motion'

// SVG de WhatsApp
function IconoWhatsApp({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// SVG de lazo decorativo
function IconoLazo({ className = 'w-5 h-4' }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" className={className}>
      <path d="M32 20 C28 14 16 8 8 12 C2 15 2 25 8 28 C16 32 28 26 32 20Z" fill="currentColor" opacity="0.6"/>
      <path d="M32 20 C36 14 48 8 56 12 C62 15 62 25 56 28 C48 32 36 26 32 20Z" fill="currentColor" opacity="0.6"/>
      <circle cx="32" cy="20" r="4" fill="currentColor"/>
    </svg>
  )
}

// SVG de corazón minimalista
function IconoCorazon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Reseñas', href: '#resenas' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Footer({ config }) {
  const scrollTo = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-white border-t border-pink-100">
      {/* Franja superior */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

          {/* Col 1 — Logo + descripción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            <span className="font-display text-3xl italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              𝓛𝓪𝔃𝓸𝓼
            </span>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs">
              Lazos artesanales elaborados con dedicación y amor. Cada pieza es única, hecha a mano para ti.
            </p>
            <div className="flex items-center gap-1.5 text-pink-300 text-xs font-light mt-1">
              <IconoLazo className="w-4 h-3 text-pink-300" />
              Artesanales desde el corazón
            </div>
          </motion.div>

          {/* Col 2 — Navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Navegar
            </p>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-500 hover:text-pink-400 transition-colors font-light"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3 — Contacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Contacto
            </p>
            <a
              href={`https://wa.me/505${config?.whatsapp || '85383864'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-500 transition-colors font-light group"
            >
              <span className="w-7 h-7 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
                <IconoWhatsApp className="w-3.5 h-3.5 text-green-500" />
              </span>
              +505 {config?.whatsapp || '85383864'}
            </a>

            <p className="text-xs text-gray-400 font-light mt-2 leading-relaxed">
              Escríbenos por WhatsApp para hacer tu pedido personalizado.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Franja inferior */}
      <div className="py-4 px-6 border-t border-pink-50">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400 font-light">
            © {new Date().getFullYear()} Lazos. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-light">
            Hecho con
            <IconoCorazon className="w-3 h-3 text-pink-300 mx-0.5" />
            y dedicación
          </div>
        </div>
      </div>
    </footer>
  )
}
