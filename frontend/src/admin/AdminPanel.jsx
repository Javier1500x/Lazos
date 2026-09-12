import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Star, Settings, BarChart2, Plus, Trash2,
  Edit2, Eye, EyeOff, Check, X, ChevronLeft,
  Crown, RefreshCw, AlertTriangle, Monitor, Smartphone,
  Tablet, Globe, TrendingUp, Users, Calendar, Clock,
  MessageCircle, Image, Megaphone, Upload,
} from 'lucide-react'

// SVGs de redes sociales (lucide no los tiene en esta versión)
const IconInstagram = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const IconFacebook = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
import { productosAPI, resenasAPI, visitasAPI, configAPI, heroImagenesAPI } from '../api'
import FormProducto from './FormProducto'
import toast from 'react-hot-toast'

// ─── Mini gráfica de barras pura CSS/SVG (sin dependencias externas) ──────────
function GraficaBarras({ datos, labelKey, valueKey, color = '#f472b6', altura = 140, titulo }) {
  if (!datos?.length) return null
  const max = Math.max(...datos.map((d) => d[valueKey]), 1)

  return (
    <div>
      {titulo && <p className="text-xs text-pink-400 font-medium uppercase tracking-wider mb-3">{titulo}</p>}
      <div className="flex items-end gap-1" style={{ height: altura }}>
        {datos.map((d, i) => {
          const pct = (d[valueKey] / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group">
              <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {d[valueKey]}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-lg min-h-[3px] cursor-pointer"
                style={{ backgroundColor: color, opacity: pct === 0 ? 0.2 : 1 }}
                title={`${d[labelKey]}: ${d[valueKey]}`}
              />
              <span className="text-xs text-gray-400 truncate max-w-full" style={{ fontSize: '0.6rem' }}>
                {String(d[labelKey]).length > 5 ? String(d[labelKey]).slice(-3) : d[labelKey]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Gráfica circular tipo dona (SVG puro)
function GraficaDona({ datos, labelKey, valueKey, titulo }) {
  if (!datos?.length) return null
  const total = datos.reduce((s, d) => s + d[valueKey], 0)
  if (total === 0) return null

  const COLORES = ['#f472b6', '#fb923c', '#a78bfa', '#34d399', '#60a5fa', '#fbbf24']
  const radio = 40
  const grosor = 18
  const circunferencia = 2 * Math.PI * radio
  let acumulado = 0

  return (
    <div>
      {titulo && <p className="text-xs text-pink-400 font-medium uppercase tracking-wider mb-3">{titulo}</p>}
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0 -rotate-90">
          {datos.map((d, i) => {
            const pct = d[valueKey] / total
            const dasharray = `${pct * circunferencia} ${circunferencia}`
            const offset = acumulado * circunferencia
            acumulado += pct
            return (
              <circle
                key={i}
                cx="50" cy="50"
                r={radio}
                fill="none"
                stroke={COLORES[i % COLORES.length]}
                strokeWidth={grosor}
                strokeDasharray={dasharray}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            )
          })}
          {/* Texto central */}
          <text x="50" y="54" textAnchor="middle" className="rotate-90 origin-center"
            style={{ fontSize: '14px', fill: '#6b7280', fontWeight: 'bold', transform: 'rotate(90deg)', transformOrigin: '50px 50px' }}>
            {total}
          </text>
        </svg>
        <div className="space-y-1.5 flex-1 min-w-0">
          {datos.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORES[i % COLORES.length] }} />
              <span className="text-xs text-gray-600 truncate capitalize">{d[labelKey] || 'desktop'}</span>
              <span className="text-xs font-semibold text-gray-800 ml-auto">{d[valueKey]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Pestaña: Productos ───────────────────────────────────────────────────────
function TabProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [creando, setCreando] = useState(false)
  const [editando, setEditando] = useState(null)

  const cargar = () => {
    setLoading(true)
    productosAPI.getAllAdmin()
      .then(({ data }) => setProductos(data.data))
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const eliminar = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await productosAPI.eliminar(id)
      toast.success('Producto eliminado')
      cargar()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const toggleActivo = async (producto) => {
    try {
      const fd = new FormData()
      fd.append('activo', (!producto.activo).toString())
      await productosAPI.editar(producto._id, fd)
      cargar()
    } catch {
      toast.error('Error al cambiar estado')
    }
  }

  if (editando) {
    return (
      <FormProducto
        productoEditar={editando}
        onGuardado={() => { setEditando(null); cargar() }}
        onCancelar={() => setEditando(null)}
      />
    )
  }

  const SECCION_BADGE = {
    hero:      { label: 'Hero',      cls: 'bg-fuchsia-100 text-fuchsia-600' },
    destacado: { label: 'Destacado', cls: 'bg-amber-100 text-amber-600' },
    catalogo:  { label: 'Catálogo',  cls: 'bg-pink-100 text-pink-600' },
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-800 text-xl italic">
          Productos ({productos.length})
        </h3>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setCreando(!creando)}
          className="flex items-center gap-1.5 bg-pink-400 hover:bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
        >
          <Plus size={15} />
          {creando ? 'Cancelar' : 'Nuevo producto'}
        </motion.button>
      </div>

      <AnimatePresence>
        {creando && (
          <FormProducto
            onGuardado={() => { setCreando(false); cargar() }}
            onCancelar={() => setCreando(false)}
          />
        )}
      </AnimatePresence>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-pink-50 rounded-xl h-20" />)}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={40} className="mx-auto mb-3 text-pink-200" />
          <p>No hay productos. ¡Crea el primero!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {productos.map((p) => {
            const badge = SECCION_BADGE[p.seccion] || SECCION_BADGE.catalogo
            return (
              <motion.div
                key={p._id}
                layout
                className="bg-white rounded-xl border border-pink-50 p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0">
                  {p.imagenes?.[0] ? (
                    <img
                      src={p.imagenes.find((i) => i.esPortada)?.url || p.imagenes[0].url}
                      alt={p.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎀</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{p.nombre}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-pink-500 font-semibold text-sm">C$ {p.precio?.toFixed(2)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                      {badge.label}
                    </span>
                    <span className="text-gray-400 text-xs">{p.imagenes?.length || 0} foto(s)</span>
                    {!p.activo && (
                      <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Oculto</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleActivo(p)}
                    title={p.activo ? 'Ocultar' : 'Mostrar'}
                    className={`p-2 rounded-full transition-colors ${p.activo ? 'text-green-500 hover:bg-green-50' : 'text-gray-300 hover:bg-gray-50'}`}
                  >
                    {p.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => setEditando(p)}
                    className="p-2 rounded-full text-pink-400 hover:bg-pink-50 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => eliminar(p._id, p.nombre)}
                    className="p-2 rounded-full text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Pestaña: Reseñas ─────────────────────────────────────────────────────────
function TabResenas() {
  const [resenas, setResenas] = useState([])
  const [loading, setLoading] = useState(true)

  const cargar = () => {
    resenasAPI.getAllAdmin()
      .then(({ data }) => setResenas(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const aprobar = async (id) => {
    try {
      await resenasAPI.aprobar(id)
      toast.success('Reseña aprobada ✅')
      cargar()
    } catch {
      toast.error('Error al aprobar')
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta reseña?')) return
    try {
      await resenasAPI.eliminar(id)
      toast.success('Reseña eliminada')
      cargar()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const pendientes = resenas.filter((r) => !r.aprobada).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="font-display font-semibold text-gray-800 text-xl italic">
          Reseñas ({resenas.length})
        </h3>
        {pendientes > 0 && (
          <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {pendientes} pendiente{pendientes > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="animate-pulse bg-pink-50 rounded-xl h-24" />)}</div>
      ) : resenas.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Star size={40} className="mx-auto mb-3 text-pink-200" />
          <p>No hay reseñas aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resenas.map((r) => (
            <motion.div key={r._id} layout className="bg-white rounded-xl border border-pink-50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-800 text-sm">{r.nombre}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={10} className={n <= r.estrellas ? 'fill-pink-400 text-pink-400' : 'text-pink-100'} />
                      ))}
                    </div>
                    {!r.aprobada && (
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">Pendiente</span>
                    )}
                    {r.aprobada && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Aprobada</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-light italic">"{r.mensaje}"</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('es-NI')}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!r.aprobada && (
                    <button onClick={() => aprobar(r._id)} className="p-2 rounded-full text-green-500 hover:bg-green-50 transition-colors" title="Aprobar">
                      <Check size={15} />
                    </button>
                  )}
                  <button onClick={() => eliminar(r._id)} className="p-2 rounded-full text-red-400 hover:bg-red-50 transition-colors" title="Eliminar">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Pestaña: Estadísticas ────────────────────────────────────────────────────
function TabEstadisticas() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrando, setBorrando] = useState(false)
  const [confirmarBorrar, setConfirmarBorrar] = useState(false)

  const cargar = () => {
    setLoading(true)
    visitasAPI.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => toast.error('Error al cargar estadísticas'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const borrarTodo = async () => {
    setBorrando(true)
    try {
      const { data } = await visitasAPI.borrarTodo()
      toast.success(`${data.eliminados} registros eliminados`)
      setConfirmarBorrar(false)
      cargar()
    } catch {
      toast.error('Error al borrar registros')
    } finally {
      setBorrando(false)
    }
  }

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[1,2,3,4].map((i) => <div key={i} className="h-20 bg-pink-50 rounded-xl" />)}
    </div>
  )

  // Formatear fechas de porDia para etiquetas más cortas
  const datosGraficaDias = stats?.porDia?.map((d) => ({
    ...d,
    label: new Date(d.fecha + 'T12:00:00').toLocaleDateString('es-NI', { weekday: 'short' }),
  })) || []

  // Horas con etiqueta
  const datosGraficaHoras = stats?.porHora?.map((d) => ({
    ...d,
    label: `${d.hora}h`,
  })) || []

  return (
    <div className="space-y-5">
      {/* Header con acciones */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display font-semibold text-gray-800 text-xl italic">
          Estadísticas de visitas
        </h3>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={cargar}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-50 hover:text-pink-400 transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={16} />
          </motion.button>
          <motion.button
            onClick={() => setConfirmarBorrar(true)}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 text-red-400 border border-red-200 hover:bg-red-50 text-sm font-medium px-3.5 py-2 rounded-full transition-colors"
          >
            <Trash2 size={14} />
            Borrar todo
          </motion.button>
        </div>
      </div>

      {/* Confirmación borrar */}
      <AnimatePresence>
        {confirmarBorrar && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">¿Borrar todos los registros?</p>
              <p className="text-xs text-red-500">Esta acción no se puede deshacer. Se eliminarán {stats?.total || 0} visitas.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setConfirmarBorrar(false)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition-colors">
                Cancelar
              </button>
              <button
                onClick={borrarTodo}
                disabled={borrando}
                className="text-xs text-white bg-red-400 hover:bg-red-500 px-3 py-1.5 rounded-full transition-colors disabled:opacity-60"
              >
                {borrando ? 'Borrando...' : 'Sí, borrar'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tarjetas numéricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total visitas', value: stats?.total || 0, icon: Users, color: 'text-pink-500' },
          { label: 'Hoy', value: stats?.hoy || 0, icon: Calendar, color: 'text-fuchsia-500' },
          { label: 'Ayer', value: stats?.ayer || 0, icon: TrendingUp, color: 'text-rose-500' },
          { label: 'Promedio diario', value: stats?.porDia?.length ? Math.round(stats.porDia.reduce((s,d)=>s+d.total,0)/7) : 0, icon: Clock, color: 'text-purple-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-pink-50 p-4 text-center shadow-sm"
          >
            <Icon size={18} className={`${color} mx-auto mb-1.5`} />
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Gráfica de barras: últimos 7 días */}
      {datosGraficaDias.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
          <GraficaBarras
            datos={datosGraficaDias}
            labelKey="label"
            valueKey="total"
            color="#f472b6"
            altura={130}
            titulo="Visitas — últimos 7 días"
          />
        </div>
      )}

      {/* Gráfica de barras: por hora */}
      {datosGraficaHoras.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
          <GraficaBarras
            datos={datosGraficaHoras}
            labelKey="label"
            valueKey="total"
            color="#c084fc"
            altura={110}
            titulo="Actividad por hora (últimas 24h)"
          />
        </div>
      )}

      {/* Gráficas dona: dispositivos y navegadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats?.porDispositivo?.length > 0 && (
          <div className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
            <GraficaDona
              datos={stats.porDispositivo}
              labelKey="_id"
              valueKey="total"
              titulo="Por dispositivo"
            />
          </div>
        )}
        {stats?.porNavegador?.length > 0 && (
          <div className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
            <GraficaDona
              datos={stats.porNavegador}
              labelKey="_id"
              valueKey="total"
              titulo="Por navegador"
            />
          </div>
        )}
      </div>

      {/* Sistema operativo */}
      {stats?.porSistema?.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
          <p className="text-xs text-pink-400 font-medium uppercase tracking-wider mb-4">Por sistema operativo</p>
          <div className="space-y-2.5">
            {stats.porSistema.map((s) => {
              const max = stats.porSistema[0].total
              const pct = Math.round((s.total / max) * 100)
              return (
                <div key={s._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{s._id || 'Desconocido'}</span>
                    <span className="font-semibold text-gray-700">{s.total}</span>
                  </div>
                  <div className="h-1.5 bg-pink-50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Últimas visitas */}
      {stats?.ultimas?.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-50 p-5 shadow-sm">
          <p className="text-xs text-pink-400 font-medium uppercase tracking-wider mb-4">Últimas visitas</p>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {stats.ultimas.map((v, i) => {
              const isDesktop = v.dispositivo === 'desktop'
              const isMobile = v.dispositivo === 'mobile'
              return (
                <motion.div
                  key={v._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-3 py-1.5 border-b border-pink-50 last:border-0 text-xs text-gray-500"
                >
                  {isMobile ? <Smartphone size={12} className="text-pink-400 flex-shrink-0" />
                    : isDesktop ? <Monitor size={12} className="text-fuchsia-400 flex-shrink-0" />
                    : <Tablet size={12} className="text-purple-400 flex-shrink-0" />}
                  <span className="flex-1 truncate">{v.navegador} · {v.sistemaOperativo}</span>
                  <span className="text-gray-400 whitespace-nowrap">
                    {new Date(v.createdAt).toLocaleString('es-NI', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Pestaña: Hero ────────────────────────────────────────────────────────────
function TabHero() {
  const [imagenes, setImagenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const [form, setForm] = useState({ titulo: '', subtitulo: '' })
  const [archivo, setArchivo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const cargar = () => {
    setLoading(true)
    heroImagenesAPI.getAllAdmin()
      .then(({ data }) => setImagenes(data.data))
      .catch(() => toast.error('Error al cargar imágenes del hero'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const elegirArchivo = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes')
      return
    }
    setArchivo(file)
    setPreview(URL.createObjectURL(file))
  }

  const subir = async (e) => {
    e.preventDefault()
    if (!archivo) return toast.error('Elige una imagen')
    if (imagenes.length >= 6) return toast.error('Ya hay 6 imágenes. Elimina una antes.')

    setSubiendo(true)
    try {
      const fd = new FormData()
      fd.append('imagen', archivo)
      fd.append('titulo', form.titulo)
      fd.append('subtitulo', form.subtitulo)
      await heroImagenesAPI.subir(fd)
      toast.success('Imagen agregada al hero 🎀')
      setArchivo(null)
      setPreview(null)
      setForm({ titulo: '', subtitulo: '' })
      cargar()
    } catch {
      toast.error('Error al subir la imagen')
    } finally {
      setSubiendo(false)
    }
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta imagen del hero?')) return
    try {
      await heroImagenesAPI.eliminar(id)
      toast.success('Imagen eliminada')
      cargar()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-pink-50 rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-gray-800 text-xl italic">Carrusel Hero</h3>
          <p className="text-sm text-gray-400 mt-0.5">Imágenes propias del carrusel principal — máx. 6</p>
        </div>
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
          imagenes.length >= 6 ? 'bg-red-100 text-red-500' : 'bg-fuchsia-100 text-fuchsia-500'
        }`}>
          {imagenes.length}/6
        </span>
      </div>

      {/* Imágenes actuales */}
      {imagenes.length > 0 && (
        <div className="bg-fuchsia-50 rounded-2xl border border-fuchsia-100 p-4">
          <p className="text-xs text-fuchsia-500 font-medium uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Crown size={12} />
            Imágenes en el hero
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {imagenes.map((img, i) => (
              <motion.div
                key={img._id}
                layout
                className="relative group rounded-xl overflow-hidden bg-white shadow-sm border border-fuchsia-100"
              >
                <div className="aspect-square">
                  <img src={img.url} alt={img.titulo || `Hero ${i + 1}`} className="w-full h-full object-cover" />
                </div>
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {img.titulo && (
                    <span className="text-white text-xs font-medium text-center leading-tight">{img.titulo}</span>
                  )}
                  <button
                    onClick={() => eliminar(img._id)}
                    className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={10} />
                    Eliminar
                  </button>
                </div>
                {/* Número */}
                <div className="absolute top-2 left-2 bg-fuchsia-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario de subida */}
      {imagenes.length < 6 && (
        <form onSubmit={subir} className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4 shadow-sm">
          <p className="text-xs text-pink-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
            <Upload size={12} />
            Agregar imagen al hero
          </p>

          {/* Drop zone */}
          <motion.div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); elegirArchivo(e.dataTransfer.files[0]) }}
            onClick={() => inputRef.current?.click()}
            animate={{ borderColor: dragging ? '#d946ef' : '#fce8f2', backgroundColor: dragging ? '#fdf4ff' : '#fffaf6' }}
            className="border-2 border-dashed rounded-2xl cursor-pointer overflow-hidden transition-colors"
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => elegirArchivo(e.target.files[0])} />

            {preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full h-52 object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setArchivo(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm hover:bg-white transition-colors"
                >
                  <X size={14} className="text-red-400" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {archivo?.name}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <motion.div
                  animate={{ y: dragging ? -4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload size={28} className="text-pink-300 mx-auto mb-2" />
                </motion.div>
                <p className="text-sm text-gray-500">
                  <span className="font-medium text-pink-400">Haz clic</span> o arrastra la imagen aquí
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — máx. 10 MB</p>
              </div>
            )}
          </motion.div>

          {/* Campos opcionales */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Título (opcional)</label>
              <input
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: Nueva colección"
                className="w-full border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-300 bg-pink-50/20"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Subtítulo (opcional)</label>
              <input
                value={form.subtitulo}
                onChange={(e) => setForm((f) => ({ ...f, subtitulo: e.target.value }))}
                placeholder="Ej: Temporada 2026"
                className="w-full border border-pink-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-pink-300 bg-pink-50/20"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              disabled={subiendo || !archivo}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={14} />
              {subiendo ? 'Subiendo...' : 'Agregar al hero'}
            </motion.button>
          </div>
        </form>
      )}

      {imagenes.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Crown size={36} className="mx-auto mb-3 text-fuchsia-200" />
          <p className="text-sm">No hay imágenes en el hero.</p>
          <p className="text-xs mt-1">Sube la primera imagen usando el formulario de arriba.</p>
        </div>
      )}
    </div>
  )
}
// ─── Componentes auxiliares de configuración (nivel superior para evitar re-montaje) ─
function CampoConfig({ label, clave, tipo = 'text', placeholder = '', config, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-500 font-medium mb-1 block">{label}</label>
      <input
        type={tipo}
        value={config[clave] ?? ''}
        onChange={(e) => onChange(clave, tipo === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 bg-pink-50/20 transition-colors"
      />
    </div>
  )
}

function ToggleConfig({ label, descripcion, clave, config, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm text-gray-700">{label}</p>
        {descripcion && <p className="text-xs text-gray-400">{descripcion}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(clave, !config[clave])}
        className={`relative rounded-full transition-colors flex-shrink-0 ${config[clave] ? 'bg-pink-400' : 'bg-gray-200'}`}
        style={{ minWidth: '2.5rem', width: '2.5rem', height: '1.375rem' }}
      >
        <motion.div
          animate={{ x: config[clave] ? 18 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  )
}

// ─── Pestaña: Configuración ───────────────────────────────────────────────────
function TabConfiguracion() {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    configAPI.get()
      .then(({ data }) => setConfig(data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (k, v) => setConfig((c) => ({ ...c, [k]: v }))

  const guardar = async () => {
    setGuardando(true)
    try {
      await configAPI.update(config)
      toast.success('Configuración guardada ✅')
    } catch {
      toast.error('Error al guardar configuración')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-pink-50 rounded-xl" />)}
    </div>
  )

  return (
    <div className="space-y-5">
      <h3 className="font-display font-semibold text-gray-800 text-xl italic">Configuración</h3>

      {/* General */}
      <div className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider">General</p>
        <CampoConfig label="Nombre del negocio" clave="nombre_negocio" placeholder="Lazos" config={config} onChange={set} />
        <div className="grid grid-cols-2 gap-4">
          <CampoConfig label="Moneda" clave="moneda" placeholder="C$" config={config} onChange={set} />
        </div>
        <ToggleConfig
          label="Mostrar precios en catálogo"
          descripcion="Si está desactivado, los clientes deben preguntar por el precio"
          clave="mostrar_precios"
          config={config}
          onChange={set}
        />
      </div>

      {/* WhatsApp */}
      <div className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
          <MessageCircle size={12} />
          WhatsApp
        </p>
        <CampoConfig label="Número (sin +505)" clave="whatsapp" placeholder="85383864" config={config} onChange={set} />
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block">Mensaje por defecto</label>
          <textarea
            value={config.whatsapp_mensaje ?? ''}
            onChange={(e) => set('whatsapp_mensaje', e.target.value)}
            rows={2}
            placeholder="¡Hola! Me interesa un pedido 🎀"
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 resize-none bg-pink-50/20"
          />
        </div>
      </div>

      {/* Hero / portada */}
      <div className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
          <Image size={12} />
          Hero / Portada
        </p>
        <CampoConfig label="Título principal" clave="hero_titulo" placeholder="Cada lazo, una historia" config={config} onChange={set} />
        <CampoConfig label="Subtítulo" clave="hero_subtitulo" placeholder="Elaborados uno por uno con dedicación" config={config} onChange={set} />
        <CampoConfig label="Badge (texto pequeño arriba)" clave="hero_badge" placeholder="Hecho a mano" config={config} onChange={set} />
      </div>

      {/* Redes sociales */}
      <div className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
          <Globe size={12} />
          Redes sociales
        </p>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block flex items-center gap-1.5">
            <IconInstagram size={11} /> Instagram (usuario sin @)
          </label>
          <input
            value={config.instagram ?? ''}
            onChange={(e) => set('instagram', e.target.value)}
            placeholder="misLazos"
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 bg-pink-50/20"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium mb-1 block flex items-center gap-1.5">
            <IconFacebook size={11} /> Facebook (usuario o URL)
          </label>
          <input
            value={config.facebook ?? ''}
            onChange={(e) => set('facebook', e.target.value)}
            placeholder="https://facebook.com/misLazos"
            className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 bg-pink-50/20"
          />
        </div>
        <CampoConfig label="TikTok (usuario sin @)" clave="tiktok" placeholder="misLazos" config={config} onChange={set} />
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider">Footer</p>
        <CampoConfig label="Texto del footer" clave="footer_texto" placeholder="Lazos artesanales hechos con amor 🎀" config={config} onChange={set} />
        <CampoConfig label="Dirección / ciudad" clave="footer_direccion" placeholder="Managua, Nicaragua" config={config} onChange={set} />
        <CampoConfig label="Meta descripción (SEO)" clave="meta_descripcion" placeholder="Tienda de lazos artesanales hechos a mano" config={config} onChange={set} />
      </div>

      {/* Anuncio flotante */}
      <div className="bg-white rounded-2xl border border-pink-50 p-5 space-y-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider flex items-center gap-1.5">
          <Megaphone size={12} />
          Anuncio flotante
        </p>
        <ToggleConfig
          label="Mostrar anuncio"
          descripcion="Muestra una barra de anuncio en la parte superior de la tienda"
          clave="anuncio_activo"
          config={config}
          onChange={set}
        />
        {/* Input siempre montado — transición CSS, no AnimatePresence, para no perder el foco */}
        <div
          style={{
            maxHeight: config.anuncio_activo ? '80px' : '0px',
            opacity: config.anuncio_activo ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
          }}
        >
          <div>
            <label className="text-xs text-gray-500 font-medium mb-1 block">Texto del anuncio</label>
            <input
              type="text"
              value={config.anuncio_texto ?? ''}
              onChange={(e) => set('anuncio_texto', e.target.value)}
              placeholder="¡Envíos gratis esta semana!"
              className="w-full border border-pink-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-pink-300 bg-pink-50/20 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={guardar}
          disabled={guardando}
          className="bg-pink-400 hover:bg-pink-500 text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm disabled:opacity-60"
        >
          {guardando ? 'Guardando...' : 'Guardar configuración'}
        </motion.button>
      </div>
    </div>
  )
}

// ─── Admin principal ──────────────────────────────────────────────────────────
const TABS = [
  { id: 'productos',  label: 'Productos',      icon: Package   },
  { id: 'hero',       label: 'Hero',            icon: Crown     },
  { id: 'resenas',    label: 'Reseñas',         icon: Star      },
  { id: 'stats',      label: 'Estadísticas',    icon: BarChart2 },
  { id: 'config',     label: 'Configuración',   icon: Settings  },
]

export default function AdminPanel() {
  const [tab, setTab] = useState('productos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl italic font-semibold text-pink-400">𝓛𝓪𝔃𝓸𝓼</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 font-medium">Admin</span>
          </div>
          <a href="/" className="flex items-center gap-1 text-sm text-gray-400 hover:text-pink-400 transition-colors">
            <ChevronLeft size={14} />
            Ver tienda
          </a>
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-6 flex gap-1 pb-0 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                  tab === t.id
                    ? 'border-pink-400 text-pink-500'
                    : 'border-transparent text-gray-500 hover:text-pink-400'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'productos'  && <TabProductos />}
            {tab === 'hero'       && <TabHero />}
            {tab === 'resenas'    && <TabResenas />}
            {tab === 'stats'      && <TabEstadisticas />}
            {tab === 'config'     && <TabConfiguracion />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
