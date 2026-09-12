# 🎀 Lazos — Tienda Online

Página web para negocio de lazos artesanales con panel de administración.

## Stack

| Parte | Tecnología |
|-------|-----------|
| Frontend | React 19 + Vite + TailwindCSS v4 + Framer Motion |
| Backend | Node.js + Express |
| Base de datos | MongoDB Atlas (gratis) |
| Imágenes | Cloudinary (gratis) |

## Estructura

```
lazos/
├── backend/          → API REST con Express
│   ├── src/
│   │   ├── config/   → Cloudinary
│   │   ├── middleware/
│   │   ├── models/   → Producto, Reseña, Visita, Configuracion
│   │   ├── routes/   → productos, reseñas, visitas, config
│   │   └── server.js
│   └── .env          → credenciales (no subir a git)
└── frontend/         → React SPA
    └── src/
        ├── admin/    → Panel admin
        ├── components/ → Hero, Catalogo, Resenas, Contacto...
        ├── hooks/
        ├── pages/
        └── api.js
```

## Cómo iniciar

### 1. Configura MongoDB Atlas
1. Ve a [mongodb.com/atlas](https://cloud.mongodb.com)
2. Crea cuenta → New Project → Build a Cluster (M0 gratis)
3. Database Access → Add User (usuario + contraseña)
4. Network Access → Add IP → Allow from anywhere (0.0.0.0/0)
5. Cluster → Connect → Drivers → copia la URI

### 2. Configura Cloudinary
1. Ve a [cloudinary.com](https://cloudinary.com) y crea cuenta
2. Dashboard → copia: Cloud Name, API Key, API Secret

### 3. Backend
```bash
cd backend
cp .env.example .env
# Edita .env con tus credenciales
npm run dev
```

### 4. Frontend
```bash
cd frontend
npm run dev
```

## URLs
- **Tienda pública:** http://localhost:5173
- **Panel admin:** http://localhost:5173/admin
- **API:** http://localhost:5000/api

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/productos | Productos activos |
| GET | /api/productos/admin | Todos los productos |
| POST | /api/productos | Crear producto (con imágenes) |
| PUT | /api/productos/:id | Editar producto |
| DELETE | /api/productos/:id | Eliminar producto |
| GET | /api/resenas | Reseñas aprobadas |
| POST | /api/resenas | Nueva reseña |
| PATCH | /api/resenas/:id/aprobar | Aprobar reseña |
| GET | /api/visitas | Estadísticas de visitas |
| GET | /api/config | Configuración actual |
| PUT | /api/config | Actualizar configuración |

## WhatsApp
Número configurado: **+505 85383864**  
Cambiable desde el panel admin → Configuración
