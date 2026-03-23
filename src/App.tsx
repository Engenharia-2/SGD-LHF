import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Processos from './pages/Processos'
import Gestao from './pages/Gestao'
import Geral from './pages/Geral'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const [user, setUser] = useState<any>(null);
  const [pingResponse, setPingResponse] = useState<string>('Esperando...')

  useEffect(() => {
    const savedUser = localStorage.getItem('sgd_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (window.electronAPI && window.electronAPI.ping) {
      window.electronAPI.ping().then((response) => {
        setPingResponse(response)
      }).catch(() => setPingResponse('Erro'))
    }
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('sgd_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sgd_user');
    localStorage.removeItem('sgd_token');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdminOrManager = user.role === 'Administrador' || user.role === 'Gestor';

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar user={user} />
        
        <div className="main-container">
          <header className="app-header">
            <div className="user-info">
              <span>Olá, <strong>{user.username}</strong> ({user.sector} - {user.role})</span>
              <button onClick={handleLogout} className="btn-logout">Sair</button>
            </div>
          </header>

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

export default App
