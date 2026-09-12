import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Reseñas', href: '#resenas' },
    { label: 'Contacto', href: '#contacto' },
  ]

  const scrollTo = (href) => {
    setMenuAbierto(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const enHero = !scrolled

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100'
            : 'bg-pink-500/90 backdrop-blur-md shadow-sm border-b border-pink-300/30'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo tipográfico */}
          <motion.button
            onClick={() => scrollTo('#inicio')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className={`font-display text-2xl font-bold italic tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400' : 'text-white'
            }`}
          >
            𝓛𝓪𝔃𝓸𝓮
          </motion.button>

          {/* Links desktop */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className={`text-sm font-medium transition-colors duration-200 relative group ${
                    scrolled ? 'text-gray-600 hover:text-pink-500' : 'text-white hover:text-pink-100'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-pink-300 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          {/* Botón menú móvil */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className={`md:hidden transition-colors ${
              scrolled ? 'text-gray-600' : 'text-white'
            }`}
            aria-label="Menú"
          >
            {menuAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-lg md:hidden"
          >
            <ul className="flex flex-col py-4 px-6 gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-base font-medium text-gray-600 hover:text-pink-400 transition-colors w-full text-left py-3 border-b border-pink-50 last:border-0"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}