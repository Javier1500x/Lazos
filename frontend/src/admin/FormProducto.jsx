import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Star as StarIcon, Sparkles, ShoppingBag, Crown } from 'lucide-react'
import { productosAPI } from '../api'
import toast from 'react-hot-toast'

// Opciones de sección con iconos y descripción
const SECCIONES = [
  {
    valor: 'catalogo',
    label: 'Catálogo',
    descripcion: 'Aparece en el catálogo general',
    icon: ShoppingBag,
    color: 'pink',
  },
  {
    valor: 'destacado',
    label: 'Destacado',
    descripcion: 'Se muestra en la sección especial',
    icon: StarIcon,
    color: 'amber',
  },
  {
    valor: 'hero',
    label: 'Hero (portada)',
    descripcion: 'Sale en el carrusel principal de la página. Máx. 6.',
    icon: Crown,
    color: 'fuchsia',
  },
]

function DropZone({ archivos, setArchivos }) {
  const inputRef = useRef()
  const [dragging, setDragging] = useState(false)

  const agregar = (files) => {
    const nuevos = Array.from(files).filter((f) => f.type.startsWith('image/'))
    setArchivos((prev) => [...prev, ...nuevos].slice(0, 6))
  }

  const eliminar = (i) => setArchivos((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div className="space-y-3">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); agregar(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        animate={{
          borderColor: dragging ? '#f472b6' : '#fce8f2',
          backgroundColor: dragging ? '#fdf2f8' : '#fffaf6',
        }}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => agregar(e.target.files)}
        />
        <motion.div
          animate={{ y: dragging ? -4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Upload size={28} className="text-pink-300 mx-auto mb-2" />
        </motion.div>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-pink-400">Haz clic</span> o arrastra imágenes aquí
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — máx. 6 fotos, 10 MB c/u</p>
      </motion.div>

      {archivos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {archivos.map((archivo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-xl overflow-hidden bg-pink-50 group"
            >
              <img
                src={URL.createObjectURL(archivo)}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); eliminar(i) }}
                className="absolute top-1 right-1 bg-white/90 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={11} className="text-red-400" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FormProducto({ onGuardado, productoEditar, onCancelar }) {
  const esEdicion = !!productoEditar

  const [form, setForm] = useState({
    nombre: productoEditar?.nombre || '',
    precio: productoEditar?.precio?.toString() || '',
    descripcion: productoEditar?.descripcion || '',
    seccion: productoEditar?.seccion || 'catalogo',
  })
  const [archivos, setArchivos] = useState([])
  const [guardando, setGuardando] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const seccionActual = SECCIONES.find((s) => s.valor === form.seccion)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) return toast.error('El nombre es obligatorio')
    if (!form.precio || isNaN(form.precio)) return toast.error('El precio es obligatorio')
    if (!esEdicion && archivos.length === 0) return toast.error('Agrega al menos una imagen')

    setGuardando(true)
    try {
      const fd = new FormData()
      fd.append('nombre', form.nombre.trim())
      fd.append('precio', form.precio)
      fd.append('descripcion', form.descripcion)
      fd.append('seccion', form.seccion)
      archivos.forEach((f) => fd.append('imagenes', f))

      if (esEdicion) {
        await productosAPI.editar(productoEditar._id, fd)
        toast.success('Producto actualizado ✅')
      } else {
        await productosAPI.crear(fd)
        toast.success('Producto creado 🎀')
      }
      onGuardado()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error al guardar')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-sm border border-pink-50 space-y-5"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-800 text-xl italic">
          {esEdicion ? 'Editar producto' : 'Nuevo producto'}
        </h3>
        {onCancelar && (
          <button type="button" onClick={onCancelar} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nombre y precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Nombre *</label>
          <input
            value={form.nombre}
            onChange={(e) => set('nombre', e.target.value)}
            required
            placeholder="Ej: Lazo rosa doble"
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 bg-pink-50/20 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Precio (C$) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.precio}
            onChange={(e) => set('precio', e.target.value)}
            required
            placeholder="0.00"
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 bg-pink-50/20 transition-colors"
          />
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-1 block">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="Describe el lazo..."
          className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 resize-none bg-pink-50/20 transition-colors"
        />
      </div>

      {/* Sección — tarjetas visuales */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-2 block">¿Dónde aparece este producto?</label>
        <div className="grid grid-cols-3 gap-2">
          {SECCIONES.map((s) => {
            const Icon = s.icon
            const activo = form.seccion === s.valor
            const colores = {
              pink:    { bg: 'bg-pink-50',    border: 'border-pink-400',    text: 'text-pink-600',    icon: 'text-pink-400'    },
              amber:   { bg: 'bg-amber-50',   border: 'border-amber-400',   text: 'text-amber-700',   icon: 'text-amber-400'   },
              fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-700', icon: 'text-fuchsia-400' },
            }[s.color]

            return (
              <motion.button
                key={s.valor}
                type="button"
                onClick={() => set('seccion', s.valor)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  activo
                    ? `${colores.bg} ${colores.border}`
                    : 'border-pink-100 bg-white hover:border-pink-200'
                }`}
              >
                <Icon size={16} className={activo ? colores.icon : 'text-gray-300'} />
                <p className={`text-xs font-semibold mt-1.5 ${activo ? colores.text : 'text-gray-600'}`}>
                  {s.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{s.descripcion}</p>
              </motion.button>
            )
          })}
        </div>

        {/* Alerta especial si elige hero */}
        <AnimatePresence>
          {form.seccion === 'hero' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <Sparkles size={14} className="text-fuchsia-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-fuchsia-700 leading-relaxed">
                  Este producto aparecerá en el <strong>carrusel principal</strong> de la página. 
                  Usa una foto de buena calidad. El sistema muestra un máximo de 6 productos en el hero.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Imágenes */}
      <div>
        <label className="text-xs text-gray-500 font-medium mb-2 block">
          Imágenes {esEdicion ? '(agrega nuevas)' : '*'}
        </label>
        <DropZone archivos={archivos} setArchivos={setArchivos} />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="px-5 py-2 rounded-full text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <motion.button
          type="submit"
          disabled={guardando}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-60 shadow-sm"
        >
          {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
        </motion.button>
      </div>
    </motion.form>
  )
}
