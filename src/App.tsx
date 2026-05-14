
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import Dashboard from './pages/Dashboard'
import Relatorios from './pages/Relatorios'
import Treinamento from './pages/Treinamento'
import Normas from './pages/Normas'
import Atas from './pages/Atas'
import Formularios from './pages/Formularios'
import Admin from './pages/Admin'
import { useAuth } from './contexts/AuthContext'
import { ROLES } from './utils/constants'
import './App.css'

function App() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Carregando Sistema...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const isAdminOrManager = user.role === ROLES.ADMIN || user.role === ROLES.GESTOR;

  return (
    <HashRouter>
      <div className="app-layout">
        <Sidebar user={user} />
        
        <div className="main-container">
          <Header user={user} onLogout={logout} />

          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/treinamento" element={<Treinamento />} />
              <Route path="/normas" element={<Normas />} />
              <Route path="/atas" element={<Atas />} />
              <Route path="/formularios" element={<Formularios />} />
              
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
    </HashRouter>
  )
}

export default App;
