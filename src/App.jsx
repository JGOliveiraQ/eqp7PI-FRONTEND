import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useAcessibilidade } from './context/AcessibilidadeContext';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import RecuperarSenhaPage from './pages/RecuperarSenhaPage';
import Home from './pages/Home';
import Agendamento from './pages/Agendamento';
import Unidades from './pages/Unidades';
import Perfil from './pages/Perfil';

function App() {
  const { modoIdoso } = useAcessibilidade();
  const { token, carregando } = useAuth();
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const timerIniciarFade = setTimeout(() => setFadeSplash(true), 1500);
    const timerOcultar = setTimeout(() => setMostrarSplash(false), 2200);

    return () => {
      clearTimeout(timerIniciarFade);
      clearTimeout(timerOcultar);
    };
  }, []);

  const estiloBase = modoIdoso ? 'text-idoso-base' : 'text-base';

  if (mostrarSplash || carregando) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-[#edf5f0] px-4 transition-all duration-700 ease-out ${
          fadeSplash ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <img
            src="/LogoVerdedeBoasVindas.png"
            alt="Logo Saúde Recife"
            className="h-28 w-auto object-contain drop-shadow-[0_8px_18px_rgba(12,110,83,0.18)] transition-transform duration-700 ease-out sm:h-36"
          />

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#0f8b5f] [animation-delay:-0.2s]" />
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#0f8b5f] [animation-delay:-0.1s]" />
            <div className="h-3 w-3 animate-bounce rounded-full bg-[#0f8b5f]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-saude-background ${estiloBase}`}>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/cadastro" element={token ? <Navigate to="/" replace /> : <CadastroPage />} />
        <Route path="/recuperar-senha" element={token ? <Navigate to="/" replace /> : <RecuperarSenhaPage />} />
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
    <div className="flex min-h-screen items-center justify-center bg-[#edf3ef] px-4 py-8">
      <div className="w-full max-w-[430px] rounded-[28px] border border-[#dfeae6] bg-white p-6 text-center shadow-[0_18px_40px_rgba(18,44,32,0.08)] sm:p-8">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#0f8b5f] text-[2.3rem] font-bold text-white">✓</div>
        <h1 className="text-[2.2rem] font-extrabold tracking-[-0.05em] text-[#15362d]">Conta criada!</h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-[#4f615d]">
          Bem-vinda ao Saúde Recife, Maria!<br />
          Sua saúde é nossa prioridade.
        </p>
        <a
          href="/login"
          className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-[16px] bg-[#0f8b5f] px-5 py-3 text-base font-bold text-white transition hover:bg-[#0b764e]"
        >
          Começar agora
        </a>
      </div>
    </div>
  );
}

export default App
