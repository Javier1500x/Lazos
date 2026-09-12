import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import PaginaPublica from './pages/PaginaPublica'
import AdminPanel from './admin/AdminPanel'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#374151',
            fontSize: '14px',
            boxShadow: '0 4px 20px rgba(244,167,195,0.2)',
            border: '1px solid #fce8f2',
          },
          success: {
            iconTheme: { primary: '#f4a7c3', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<PaginaPublica />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}
