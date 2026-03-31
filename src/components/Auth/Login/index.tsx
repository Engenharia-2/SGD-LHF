import React, { useState } from 'react';
import './styles.css';
import { useAlert } from '../../../contexts/AlertContext';
import { useAuth } from '../../../contexts/AuthContext';

interface LoginProps {
  onLogin?: (userData: any) => void;
}

const Login: React.FC<LoginProps> = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sector, setSector] = useState('Geral');
  const [role, setRole] = useState('Funcionario');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const {
    showAlert
  } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';
    const payload = isRegistering 
      ? { username, password, sector, role } 
      : { username, password };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na autenticação');
      }

      if (isRegistering) {
        showAlert(data.message || 'Conta criada com sucesso! Faça login.', 'success');
        setIsRegistering(false);
        setPassword('');
      } else {
        // O payload do login está em data.data
        login(data.data.user, data.data.token);
      }
    } catch (err: any) {
      setError(err.message);
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegistering ? 'Criar Conta' : 'Login'}</h2>
        <p>Sistema de Gerenciamento de Documentos - LHF</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </div>

          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="sector">Setor</label>
                <select 
                  id="sector" 
                  value={sector} 
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="Qualidade">Qualidade</option>
                  <option value="Produção">Produção</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Vendas">Vendas</option>
                  <option value="Assistência">Assistência</option>
                  <option value="Estoque">Estoque</option>
                  <option value="Engenharia">Engenharia</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="role">Nível de Cargo</label>
                <select 
                  id="role" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Gestor">Gestor</option>
                  <option value="Funcionario">Funcionario</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Carregando...' : (isRegistering ? 'Registrar' : 'Entrar')}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            type="button" 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="btn-link"
          >
            {isRegistering ? 'Já tem conta? Faça Login' : 'Não tem conta? Crie uma aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
