import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { resenasAPI } from '../api'
import toast from 'react-hot-toast'

function EstrellasSolidas({ cantidad }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={13}
          className={n <= cantidad ? 'fill-pink-400 text-pink-400' : 'text-pink-100 fill-pink-100'}
        />
      ))}
    </div>
  )
}

function TarjetaResena({ resena }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50 flex flex-col gap-3 min-w-[280px] max-w-sm"
    >
      <EstrellasSolidas cantidad={resena.estrellas} />

      {/* Comillas SVG decorativas */}
      <div className="relative">
        <svg className="w-6 h-6 text-pink-100 absolute -top-1 -left-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
        <p className="text-gray-600 font-light text-sm leading-relaxed pl-5">
          {resena.mensaje}
        </p>
      </div>

      {/* Nombre */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-pink-50">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center text-pink-600 font-semibold text-xs">
          {resena.nombre.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700">{resena.nombre}</span>
      </div>
    </motion.div>
  )
}

function FormularioResena({ onEnviado }) {
  const [form, setForm] = useState({ nombre: '', mensaje: '', estrellas: 5 })
  const [enviando, setEnviando] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.mensaje.trim()) return
    setEnviando(true)
    try {
      await resenasAPI.crear(form)
      toast.success('Reseña enviada. Será visible pronto.')
      setForm({ nombre: '', mensaje: '', estrellas: 5 })
      onEnviado()
    } catch {
      toast.error('Error al enviar la reseña. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="overflow-hidden"
    >
      <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm max-w-md mx-auto mt-8 flex flex-col gap-4">
        <h4 className="font-display font-semibold text-gray-800 text-lg italic">
          Tu experiencia
        </h4>

        {/* Estrellas interactivas */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set('estrellas', n)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={22}
                className={
                  n <= form.estrellas
                    ? 'fill-pink-400 text-pink-400'
                    : 'text-pink-200 fill-pink-100 hover:text-pink-300'
                }
              />
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Tu nombre"
          value={form.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          maxLength={60}
          required
          className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 transition-colors bg-pink-50/30"
        />

        <textarea
          placeholder="Cuenta tu experiencia..."
          value={form.mensaje}
          onChange={(e) => set('mensaje', e.target.value)}
          maxLength={300}
          required
          rows={3}
          className="border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 transition-colors resize-none bg-pink-50/30"
        />

        <motion.button
          type="submit"
          disabled={enviando}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-2.5 rounded-full text-sm transition-colors disabled:opacity-60"
        >
          {enviando ? 'Enviando...' : 'Enviar reseña'}
        </motion.button>
      </div>
    </motion.form>
  )
}

export default function Resenas() {
  const [resenas, setResenas] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagina, setPagina] = useState(0)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const POR_PAGINA = 3

  const cargar = () => {
    resenasAPI
      .getAll()
      .then(({ data }) => setResenas(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const totalPaginas = Math.ceil(resenas.length / POR_PAGINA)
  const resenasVisibles = resenas.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA)

  return (
    <section id="resenas" className="py-24 px-6 bg-gradient-to-b from-pink-50/40 to-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-pink-400 text-sm font-medium tracking-widest uppercase mb-3">
            Lo que dicen
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-800 italic mb-4">
            Reseñas
          </h2>
          <div className="w-16 h-0.5 bg-pink-300 mx-auto" />
        </motion.div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-6 w-72 h-40 border border-pink-50" />
            ))}
          </div>
        ) : resenas.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MessageSquare size={36} className="mx-auto mb-3 text-pink-200" />
            <p className="font-light text-sm">Aún no hay reseñas. Sé el primero en dejar una.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-5">
              <AnimatePresence mode="wait">
                {resenasVisibles.map((r) => (
                  <TarjetaResena key={r._id} resena={r} />
                ))}
              </AnimatePresence>
            </div>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setPagina((p) => Math.max(0, p - 1))}
                  disabled={pagina === 0}
                  className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center text-pink-400 hover:bg-pink-50 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-400">{pagina + 1} / {totalPaginas}</span>
                <button
                  onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
                  disabled={pagina === totalPaginas - 1}
                  className="w-9 h-9 rounded-full border border-pink-200 flex items-center justify-center text-pink-400 hover:bg-pink-50 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="border border-pink-300 text-pink-500 hover:bg-pink-50 font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            {mostrarFormulario ? 'Cerrar' : '+ Dejar una reseña'}
          </motion.button>
        </div>

        <AnimatePresence>
          {mostrarFormulario && (
            <FormularioResena
              onEnviado={() => { setMostrarFormulario(false); cargar() }}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
