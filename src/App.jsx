import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import RecuperarSenhaPage from './pages/RecuperarSenhaPage';
import Unidades from './pages/Unidades';
import AdminDashboard from './pages/AdminDashboard';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import {
  AppointmentCancelled,
  AppointmentDetails,
  AppointmentSuccess,
  DoctorProfile,
  EditPatientProfile,
  HealthAssistant,
  HealthPlan,
  HelpSupport,
  MyAppointments,
  PatientHome,
  PatientNotifications,
  PatientProfile,
  PrivacyAndSecurity,
  ScheduleAppointment,
  SearchCare,
  RescheduleAppointment,
  TermsOfUse,
} from './pages/PatientPortal';

function App() {
  const { token, usuario, carregando } = useAuth();
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  useEffect(() => {
    const timerIniciarFade = setTimeout(() => setFadeSplash(true), 1200);
    const timerOcultar = setTimeout(() => setMostrarSplash(false), 1800);

    return () => {
      clearTimeout(timerIniciarFade);
      clearTimeout(timerOcultar);
    };
  }, []);

  if (mostrarSplash || carregando) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center bg-[#edf5f0] px-4 transition-all duration-700 ease-out ${
          fadeSplash ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-5 text-center">
          <img
            src="/logocompacta.png"
            alt="Logo Saúde Recife"
            className="h-20 w-auto object-contain drop-shadow-[0_8px_18px_rgba(12,110,83,0.18)] transition-transform duration-700 ease-out sm:h-24"
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
    <div className="min-h-screen bg-[#f3f7f5]">
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/cadastro" element={token ? <Navigate to="/" replace /> : <CadastroPage />} />
        <Route path="/recuperar-senha" element={token ? <Navigate to="/" replace /> : <RecuperarSenhaPage />} />
        <Route path="/cadastro/sucesso" element={<CadastroSucessoPage />} />
        <Route path="/" element={token ? usuario?.tipo === 'ADMIN' ? <Navigate to="/admin" replace /> : usuario?.tipo === 'MEDICO' ? <Navigate to="/profissional" replace /> : <PatientHome /> : <Navigate to="/login" replace />} />
        <Route path="/unidades" element={token ? <Unidades /> : <Navigate to="/login" replace />} />
        <Route path="/perfil" element={token ? <PatientProfile /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={usuario?.tipo === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/agenda" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/disponibilidade" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/consulta" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/prontuario" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/paciente" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/notificacoes" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/profissional/perfil" element={usuario?.tipo === 'MEDICO' ? <ProfessionalDashboard /> : <Navigate to="/" replace />} />
        <Route path="/buscar-atendimento" element={token ? <SearchCare /> : <Navigate to="/login" replace />} />
        <Route path="/perfil-medico" element={token ? <DoctorProfile /> : <Navigate to="/login" replace />} />
        <Route path="/agendar-consulta" element={token ? <ScheduleAppointment /> : <Navigate to="/login" replace />} />
        <Route path="/assistente-ia" element={token && usuario?.tipo === 'PACIENTE' ? <HealthAssistant /> : <Navigate to="/" replace />} />
        <Route path="/consulta-sucesso" element={token ? <AppointmentSuccess /> : <Navigate to="/login" replace />} />
        <Route path="/meus-agendamentos" element={token ? <MyAppointments /> : <Navigate to="/login" replace />} />
        <Route path="/detalhes-consulta" element={token ? <AppointmentDetails /> : <Navigate to="/login" replace />} />
        <Route path="/consulta-cancelada" element={token ? <AppointmentCancelled /> : <Navigate to="/login" replace />} />
        <Route path="/reagendar-consulta" element={token ? <RescheduleAppointment /> : <Navigate to="/login" replace />} />
        <Route path="/editar-perfil" element={token ? <EditPatientProfile /> : <Navigate to="/login" replace />} />
        <Route path="/notificacoes" element={token ? <PatientNotifications /> : <Navigate to="/login" replace />} />
        <Route path="/plano-saude" element={token ? <HealthPlan /> : <Navigate to="/login" replace />} />
        <Route path="/privacidade" element={token ? <PrivacyAndSecurity /> : <Navigate to="/login" replace />} />
        <Route path="/ajuda" element={token ? <HelpSupport /> : <Navigate to="/login" replace />} />
        <Route path="/termos" element={token ? <TermsOfUse /> : <Navigate to="/login" replace />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function CadastroSucessoPage() {
  const { usuario } = useAuth();
  const nomeExibicao = usuario?.nome?.trim()?.split(/\s+/)[0] || 'usuária';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f7f5] px-4 py-8">
      <div className="w-full max-w-[430px] rounded-[28px] bg-[#f7faf8] p-6 text-center shadow-[0_4px_12px_rgba(18,44,32,0.04)] sm:p-8">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#0f8b5f] text-[2.3rem] font-bold text-white">✓</div>
        <h1 className="text-[2.2rem] font-extrabold tracking-[-0.05em] text-[#15362d]">Conta criada!</h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-[#4f615d]">
          Bem-vinda ao Saúde Recife, {nomeExibicao}!<br />
          Sua saúde é nossa prioridade.
        </p>
        <Link
          to="/login"
          className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-[16px] bg-[#0f8b5f] px-5 py-3 text-base font-bold text-white transition hover:bg-[#0b764e]"
        >
          Começar agora
        </Link>
      </div>
    </div>
  );
}

export default App;

