import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Dashboard from './pages/Dashboard'
import Processos from './pages/Processos'
import Gestao from './pages/Gestao'
import Geral from './pages/Geral'
import Admin from './pages/Admin'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function App() {
  const { user, logout, isLoading } = useAuth();
  const [pingResponse, setPingResponse] = useState<string>('Esperando...')

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.ping) {
      window.electronAPI.ping().then((response) => {
        setPingResponse(response)
      }).catch(() => setPingResponse('Erro'))
    }
  }, [])

  if (isLoading) {
    return <div className="loading-screen">Carregando Sistema...</div>;
  }

  if (!user) {
    return <Login onLogin={() => {}} />; // onLogin será removido do componente Login depois
  }

  const isAdminOrManager = user.role === 'Administrador' || user.role === 'Gestor';

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar user={user} />
        
        <div className="main-container">
          <Header user={user} onLogout={logout} />

          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard user={user} pingResponse={pingResponse} />} />
              <Route path="/processos" element={<Processos />} />
              <Route path="/gestao" element={<Gestao />} />
              <Route path="/geral" element={<Geral />} />
              
              {/* Rota Protegida */}
              {isAdminOrManager ? (
                <Route path="/admin" element={<Admin user={user} />} />
              ) : (
                <Route path="/admin" element={<Navigate to="/" />} />
              )}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
