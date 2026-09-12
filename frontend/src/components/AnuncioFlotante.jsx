import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function AnuncioFlotante({ config }) {
  const [visible, setVisible] = useState(true)

  if (!config?.anuncio_activo || !config?.anuncio_texto) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium py-2 px-4 flex items-center justify-center gap-2 shadow-lg"
        >
          <span className="truncate">{config.anuncio_texto}</span>
          <button
            onClick={() => setVisible(false)}
            className="ml-3 flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Cerrar anuncio"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}