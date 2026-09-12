import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ChevronLeft, ChevronRight, Sparkles, ShoppingBag } from 'lucide-react'
import { heroImagenesAPI } from '../api'

const FONDOS = [
  'from-pink-100 via-rose-50 to-white',
  'from-rose-100 via-pink-50 to-white',
  'from-fuchsia-50 via-pink-50 to-white',
  'from-pink-200 via-rose-100 to-white',
  'from-red-50 via-pink-50 to-white',
]

const OPCIONES_TITULO = [
  'Cada lazo, una historia',
  'Hecho con las manos y el corazón',
  'Lazos que enamoran',
  'Artesanía que se siente',
  'Detalles hechos a mano',
  'Pequeños lazos, grandes emociones',
  'Tu detalle especial',
  'Hechos con amor y dedicación',
]

const OPCIONES_SUBTITULO = [
  'Elaborados uno por uno con dedicación',
  'Diseñados para momentos especiales',
  'Toque artesanal en cada detalle',
  'Producto 100% nicaragüense',
  'Tradición hecha lazo a lazo',
  'Donde el arte se encuentra el corazón',
  'Heredados de nuestras manos',
  'Tu próximo lazo te espera aquí',
]

const OPCIONES_BADGE = [
  'Hecho a mano',
  'Artesanías nicaragüenses',
  'Cada pieza es única',
  'Con amor, desde Nicaragua',
  'Trabajo artesanal',
  'Hechos uno a uno',
]

function Particulas({ slide }) {
  const formas = [
    { x: 6,  y: 18, s: 10, delay: 0,   tipo: 'circle' },
    { x: 90, y: 12, s: 14, delay: 0.7, tipo: 'bow' },
    { x: 12, y: 72, s: 8,  delay: 1.2, tipo: 'circle' },
    { x: 88, y: 68, s: 12, delay: 0.4, tipo: 'bow' },
    { x: 48, y: 6,  s: 16, delay: 0.2, tipo: 'circle' },
    { x: 22, y: 42, s: 7,  delay: 1.5, tipo: 'bow' },
    { x: 78, y: 38, s: 9,  delay: 0.9, tipo: 'circle' },
    { x: 62, y: 82, s: 11, delay: 0.5, tipo: 'bow' },
    { x: 35, y: 88, s: 6,  delay: 1.8, tipo: 'circle' },
    { x: 55, y: 25, s: 8,  delay: 1.1, tipo: 'circle' },
  ]

  return (
    <>
      {formas.map((p, i) => (
        <motion.div
          key={`${slide}-${i}`}
          className="absolute pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.6, 0.3, 0.6, 0],
            scale:   [0, 1,   0.8, 1,   0],
            y:       [0, -20, -10, -25, -35],
            rotate:  p.tipo === 'bow' ? [0, 15, -10, 20, 0] : [0, 0, 0, 0, 0],
          }}
          transition={{
            duration: 6 + i * 0.4,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.tipo === 'bow' ? (
            <svg width={p.s * 2} height={p.s * 1.4} viewBox="0 0 24 16" fill="none">
              <ellipse cx="6"  cy="8" rx="5.5" ry="4" fill="#f9a8c9" opacity="0.7" />
              <ellipse cx="18" cy="8" rx="5.5" ry="4" fill="#f9a8c9" opacity="0.7" />
              <circle  cx="12" cy="8" r="2.5" fill="#f472b6" opacity="0.9" />
            </svg>
          ) : (
            <div className="rounded-full bg-pink-300/40" style={{ width: p.s, height: p.s }} />
          )}
        </motion.div>
      ))}
    </>
  )
}

function TituloAnimado({ texto, key: k }) {
  return (
    <span key={k} className="inline-block">
      {texto.split('').map((letra, i) => (
        <motion.span
          key={`${k}-${i}`}
          className="inline-block"
          initial={{ y: 60, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.2 + i * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {letra === ' ' ? '\u00A0' : letra}
        </motion.span>
      ))}
    </span>
  )
}

function BarraProgreso({ activo, duracion }) {
  return (
    <motion.div
      key={activo}
      className="h-0.5 bg-pink-400 rounded-full origin-left"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: duracion / 1000, ease: 'linear' }}
    />
  )
}

const DURACION_AUTO = 5500

export default function Hero({ config }) {
  const [productosHero, setProductosHero] = useState([])
  const [slide, setSlide] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [textoIndex, setTextoIndex] = useState(0)

  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 600], [0, 120])

  const whatsappUrl = `https://wa.me/505${config?.whatsapp || '85383864'}?text=${encodeURIComponent(
    config?.whatsapp_mensaje || 'Hola, me interesa hacer un pedido de lazos'
  )}`

  const scrollCatalogo = () =>
    document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    heroImagenesAPI.getAll()
      .then(({ data }) => {
        setProductosHero(data.data.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    if (cargando) return
    const t = setInterval(() => {
      setTextoIndex((i) => (i + 1) % OPCIONES_TITULO.length)
    }, 8000)
    return () => clearInterval(t)
  }, [cargando])

  const total = productosHero.length || FONDOS.length
  const tieneImagenes = productosHero.length > 0

  const cambiar = useCallback((dir) => {
    setDireccion(dir)
    setSlide((s) => (s + dir + total) % total)
  }, [total])

  useEffect(() => {
    if (cargando) return
    const t = setInterval(() => cambiar(1), DURACION_AUTO)
    return () => clearInterval(t)
  }, [cambiar, cargando])

  const imagenActual2 = tieneImagenes ? productosHero[slide] : null
  const imagenActual = imagenActual2?.url || null
  const fondoActual = FONDOS[slide % FONDOS.length]

  const textoTitulo = config?.hero_titulo || OPCIONES_TITULO[textoIndex]
  const textoSubtitulo = config?.hero_subtitulo || OPCIONES_SUBTITULO[textoIndex]
  const textoBadge = config?.hero_badge || OPCIONES_BADGE[textoIndex]

  const variants = {
    enter:  (d) => ({ opacity: 0, scale: 1.06, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, scale: 1, x: 0 },
    exit:   (d) => ({ opacity: 0, scale: 0.96, x: d > 0 ? -40 : 40 }),
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Fondo / imagen del slide ─────────────────────── */}
      <AnimatePresence custom={direccion} mode="sync">
        {imagenActual ? (
          <motion.div
            key={`img-${slide}`}
            custom={direccion}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.div style={{ y: yParallax }} className="absolute inset-0 scale-110">
              <img
                src={imagenActual}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-50 saturate-150"
              />
              <img
                src={imagenActual}
                alt={imagenActual2?.titulo || 'Hero'}
                className="relative w-full h-full object-contain"
              />
            </motion.div>
            {/* Overlays con z bajo — no interfieren con el contenido */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent z-[5] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[5] pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key={`bg-${slide}`}
            custom={direccion}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 bg-gradient-to-br ${fondoActual}`}
          />
        )}
      </AnimatePresence>

      {/* Overlays fijos que NO cambian con la animación */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent z-[6] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-[6] pointer-events-none" />

      {/* Blobs decorativos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"
        />
      </div>

      {/* Partículas */}
      <Particulas slide={slide} />

      {/* ── Contenido — z-[15] por encima de TODOS los overlays ── */}
      <div className={`relative z-[15] px-6 max-w-4xl mx-auto w-full ${imagenActual ? 'text-white' : 'text-center'}`}>
        <div className={imagenActual ? 'max-w-xl' : 'text-center mx-auto'}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6 shadow-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <Sparkles size={13} className={imagenActual ? 'text-pink-200' : 'text-pink-400'} />
            </motion.div>
            <span className={imagenActual ? 'text-white/90' : 'text-pink-500'}>
              {textoBadge}
            </span>
          </motion.div>

          {/* Logo decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-7xl md:text-9xl font-bold italic leading-none select-none mb-4 ${
              imagenActual
                ? 'text-white drop-shadow-2xl'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500'
            }`}
          >
            𝓛𝓪𝔃𝓸𝓼
          </motion.div>

          {/* Título animado */}
          <h1 className={`font-display text-2xl md:text-3xl font-medium mb-3 italic overflow-hidden ${
            imagenActual ? 'text-white/95' : 'text-gray-700'
          }`}>
            <TituloAnimado
              texto={textoTitulo}
              key={slide}
            />
          </h1>

          {/* Subtítulo */}
          <motion.p
            key={`sub-${slide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className={`text-lg mb-3 font-light ${
              imagenActual ? 'text-white/80' : 'text-gray-500'
            }`}
          >
            {textoSubtitulo}
          </motion.p>

          {/* Título y subtítulo de la imagen hero actual */}
          <AnimatePresence mode="wait">
            {imagenActual2 && (imagenActual2.titulo || imagenActual2.subtitulo) && (
              <motion.div
                key={`prod-${slide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="h-px w-8 bg-pink-300/70" />
                {imagenActual2.titulo && (
                  <span className="text-pink-200 text-sm font-medium">
                    {imagenActual2.titulo}
                  </span>
                )}
                {imagenActual2.subtitulo && (
                  <span className="text-white/60 text-xs">
                    {imagenActual2.subtitulo}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botones — siempre con color visible */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className={`flex flex-col sm:flex-row items-center gap-4 ${
              imagenActual ? '' : 'justify-center'
            }`}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 35px rgba(244,114,182,0.5)' }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollCatalogo}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-lg text-sm tracking-wide"
            >
              <ShoppingBag size={16} />
              Ver catálogo
            </motion.button>

            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 font-medium px-8 py-3.5 rounded-full transition-all text-sm tracking-wide border ${
                imagenActual
                  ? 'border-white/40 text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm shadow-sm'
                  : 'border-pink-300 text-pink-600 hover:bg-pink-50'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hacer un pedido
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* ── Controles del carrusel ────────────────────────── */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30">
        <div className="w-32 bg-white/20 rounded-full overflow-hidden h-0.5">
          <BarraProgreso activo={slide} duracion={DURACION_AUTO} />
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => cambiar(-1)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/35 transition-colors shadow-sm"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </motion.button>

          <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDireccion(i > slide ? 1 : -1); setSlide(i) }}
                animate={{
                  width: i === slide ? 20 : 8,
                  backgroundColor: i === slide ? '#f472b6' : 'rgba(255,255,255,0.5)',
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={() => cambiar(1)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/35 transition-colors shadow-sm"
            aria-label="Siguiente"
          >
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {tieneImagenes && (
          <div className="flex gap-2 mt-1">
            {productosHero.map((img, i) => (
              <motion.button
                key={img._id}
                onClick={() => { setDireccion(i > slide ? 1 : -1); setSlide(i) }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ opacity: i === slide ? 1 : 0.5, scale: i === slide ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-lg overflow-hidden border-2 transition-colors"
                style={{ borderColor: i === slide ? '#f472b6' : 'transparent' }}
                aria-label={img.titulo || `Slide ${i + 1}`}
              >
                {img.url ? (
                  <img src={img.url} alt={img.titulo || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-pink-200/40 flex items-center justify-center text-xs">🎀</div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── Scroll indicator ─────────────────────────────── */}
      <motion.button
        onClick={scrollCatalogo}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
        aria-label="Ver más"
      >
        <span className="text-xs font-light tracking-widest uppercase">Ver más</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  )
}