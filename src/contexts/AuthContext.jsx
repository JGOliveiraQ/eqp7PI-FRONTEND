import { createContext, useContext, useEffect, useState } from 'react';
import api, { loginAdministrador, loginMedico, loginPaciente } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');

    if (tokenSalvo) {
      setToken(tokenSalvo);
      if (usuarioSalvo) {
        try {
          setUsuario(JSON.parse(usuarioSalvo));
        } catch {
          localStorage.removeItem('usuario');
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

  const login = async (email, senha, perfil = 'paciente') => {
    const dados = perfil === 'medico'
      ? await loginMedico(email, senha)
      : perfil === 'admin'
        ? await loginAdministrador(email, senha)
        : await loginPaciente(email, senha);

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
    setToken('');
    setUsuario(null);
  };

  const atualizarUsuarioLocal = (usuarioAtualizado) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
    setUsuario(usuarioAtualizado);
  };

  const valor = { usuario, token, carregando, login, cadastrar, logout, atualizarUsuarioLocal };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return contexto;
}
