import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function IconoWhatsApp({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FormularioPedido({ config, onCerrar }) {
  const [form, setForm] = useState({ nombre: '', tipo: '', cantidad: '1', nota: '' })
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleEnviar = (e) => {
    e.preventDefault()
    const mensaje = `Hola, me llamo *${form.nombre}* y me gustaría hacer un pedido:\n\n• Tipo de lazo: ${form.tipo}\n• Cantidad: ${form.cantidad}${form.nota ? `\n• Nota: ${form.nota}` : ''}`
    const url = `https://wa.me/505${config?.whatsapp || '85383864'}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
    toast.success('Redirigiendo a WhatsApp...')
    onCerrar()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-white rounded-2xl p-6 border border-pink-100 shadow-md max-w-md w-full"
    >
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-display font-semibold text-gray-800 text-xl italic">
          Hacer un pedido
        </h4>
        <button onClick={onCerrar} className="text-gray-300 hover:text-gray-500 transition-colors">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleEnviar} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block uppercase tracking-wide">Tu nombre</label>
          <input
            type="text"
            placeholder="Ej: María González"
            value={form.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            required
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 transition-colors bg-pink-50/20"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block uppercase tracking-wide">Tipo de lazo</label>
          <input
            type="text"
            placeholder="Ej: lazo rosa para niña, lazo navideño..."
            value={form.tipo}
            onChange={(e) => set('tipo', e.target.value)}
            required
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 transition-colors bg-pink-50/20"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block uppercase tracking-wide">Cantidad</label>
          <input
            type="number"
            min="1"
            value={form.cantidad}
            onChange={(e) => set('cantidad', e.target.value)}
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 transition-colors bg-pink-50/20"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 font-medium mb-1 block uppercase tracking-wide">Notas (opcional)</label>
          <textarea
            placeholder="Colores, tamaño, para qué ocasión..."
            value={form.nota}
            onChange={(e) => set('nota', e.target.value)}
            rows={2}
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 transition-colors resize-none bg-pink-50/20"
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-full text-sm transition-colors shadow-sm"
        >
          <IconoWhatsApp className="w-4 h-4" />
          Enviar por WhatsApp
        </motion.button>
      </form>
    </motion.div>
  )
}

export default function Contacto({ config }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const whatsappUrl = `https://wa.me/505${config?.whatsapp || '85383864'}?text=${encodeURIComponent(
    config?.whatsapp_mensaje || 'Hola, me interesa hacer un pedido'
  )}`

  return (
    <section id="contacto" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-pink-400 text-sm font-medium tracking-widest uppercase mb-3">
            Contáctanos
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-800 italic mb-4">
            Hagamos tu pedido
          </h2>
          <div className="w-16 h-0.5 bg-pink-300 mx-auto mb-6" />
          <p className="text-gray-500 font-light mb-10 max-w-md mx-auto text-sm leading-relaxed">
            Escríbenos por WhatsApp y te asesoramos con gusto. Elaboramos lazos personalizados para cualquier ocasión.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(244,167,195,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white font-medium px-7 py-3.5 rounded-full transition-colors shadow-md text-sm"
            >
              <Send size={14} />
              Hacer un pedido
            </motion.button>

            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 border border-green-200 text-green-600 hover:bg-green-50 font-medium px-7 py-3.5 rounded-full transition-colors text-sm"
            >
              <IconoWhatsApp className="w-4 h-4" />
              WhatsApp directo
            </motion.a>
          </div>
        </motion.div>

        <AnimatePresence>
          {mostrarFormulario && (
            <div className="mt-8 flex justify-center">
              <FormularioPedido
                config={config}
                onCerrar={() => setMostrarFormulario(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
