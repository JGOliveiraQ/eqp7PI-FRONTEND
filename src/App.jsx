import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useAcessibilidade } from './context/AcessibilidadeContext';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import Home from './pages/Home';
import Agendamento from './pages/Agendamento';
import Unidades from './pages/Unidades';
import Perfil from './pages/Perfil';

function App() {
  const { modoIdoso } = useAcessibilidade();
  const { token, carregando } = useAuth();

  const estiloBase = modoIdoso ? 'text-idoso-base' : 'text-base';

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-saude-background text-saude-primary">
        <div className="text-lg font-semibold">Carregando...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-saude-background ${estiloBase}`}>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/cadastro" element={token ? <Navigate to="/" replace /> : <CadastroPage />} />
        <Route path="/cadastro/sucesso" element={<CadastroSucessoPage />} />
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/agendamento" element={token ? <Agendamento /> : <Navigate to="/login" replace />} />
        <Route path="/unidades" element={token ? <Unidades /> : <Navigate to="/login" replace />} />
        <Route path="/perfil" element={token ? <Perfil /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
      </Routes>
    </div>
  );
}

function CadastroSucessoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-saude-background px-4">
      <div className="w-full max-w-md rounded-card bg-white p-8 text-center shadow-lg ring-1 ring-saude-border">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-saude-light text-3xl">✓</div>
        <h1 className="text-2xl font-bold text-saude-darkText">Conta criada!</h1>
        <p className="mt-3 text-saude-secondaryText">
          Seu cadastro foi realizado com sucesso. Agora você pode entrar na plataforma.
        </p>
        <a
          href="/login"
          className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-xl bg-saude-primary px-5 py-3 font-bold text-white transition hover:bg-saude-primaryHover"
        >
          Ir para login
        </a>
      </div>
    </div>
  );
}

export default App
