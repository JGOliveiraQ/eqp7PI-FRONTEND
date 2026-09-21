import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token') || '');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token') || sessionStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (tokenSalvo) {
      setToken(tokenSalvo);
      if (usuarioSalvo) {
        try {
          setUsuario(JSON.parse(usuarioSalvo));
        } catch {
          setUsuario(null);
        }
      }
    }

    setCarregando(false);
  }, []);

  const persistirSessao = (novoToken, novoUsuario) => {
    localStorage.setItem('token', novoToken);
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
    setToken(novoToken);
    setUsuario(novoUsuario);
  };

  const login = async (email, senha) => {
    const resposta = await api.post('/auth/login', { email, senha });
    const dados = resposta.data;

    persistirSessao(dados.token, dados.usuario);
    return dados;
  };

  const cadastrar = async (dadosPaciente) => {
    const resposta = await api.post('/auth/cadastro', dadosPaciente);
    const dados = resposta.data;

    if (dados?.token) {
      persistirSessao(dados.token, dados.usuario);
    }

    return dados;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    setToken('');
    setUsuario(null);
  };

  const valor = useMemo(
    () => ({ usuario, token, carregando, login, cadastrar, logout }),
    [usuario, token, carregando]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return contexto;
}
