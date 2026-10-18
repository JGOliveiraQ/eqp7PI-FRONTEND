import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, HeartPulse, UserRound, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const tabs = [
  { id: 'paciente', label: 'Paciente', icone: UserRound },
  { id: 'medico', label: 'Médico', icone: Stethoscope },
];

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [perfil, setPerfil] = useState('paciente');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [logoFalhou, setLogoFalhou] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email.trim(), senha);
      navigate('/');
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4f0] px-3 py-8 sm:px-4 lg:px-6">
      <main className="mx-auto flex max-w-[1250px] items-center justify-center">
        <div className="grid w-full max-w-[1140px] gap-5 lg:grid-cols-[0.95fr_0.92fr]">
          <aside className="hidden min-h-[760px] items-center justify-center overflow-hidden rounded-[30px] border border-[#e0e8e3] bg-[#f4f7f5] shadow-[0_12px_30px_rgba(18,44,32,0.04)] lg:flex">
            <div className="relative h-full w-full">
              {!logoFalhou ? (
                <img
                  src="/MascoteRobóticodeSaúdeRecife.png"
                  alt="Mascote Robótico de Saúde Recife"
                  className="h-full w-full object-cover"
                  onError={() => setLogoFalhou(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#eaf7f0] text-[#0d7f57]">
                  <HeartPulse className="h-16 w-16" />
                </div>
              )}
            </div>
          </aside>

          <div className="mx-auto flex w-full max-w-[420px] items-center justify-center rounded-[28px] border border-[#dfeae6] bg-white p-5 shadow-[0_24px_40px_rgba(18,44,32,0.08)] sm:p-7 lg:max-w-none">
            <div className="w-full">
              <div className="mb-4 flex justify-center lg:hidden">
                {!logoFalhou ? (
                  <img
                    src="/logo-saude-recife.png"
                    alt="Logo Saúde Recife"
                    className="h-40 w-auto object-contain drop-shadow-sm sm:h-48"
                    onError={() => setLogoFalhou(true)}
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-[22px] bg-[#eaf7f0] text-[#0d7f57] shadow-sm sm:h-48 sm:w-48">
                    <HeartPulse className="h-14 w-14 sm:h-16 sm:w-16" />
                  </div>
                )}
              </div>

              <div className="mb-5 flex justify-center">
                {!logoFalhou ? (
                  <img
                    src="/logocompacta.png"
                    alt="Logo compacta Saúde Recife"
                    className="h-16 w-auto object-contain drop-shadow-sm sm:h-20"
                    onError={() => setLogoFalhou(true)}
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf7f0] text-[#0d7f57] shadow-sm sm:h-20 sm:w-20">
                    <HeartPulse className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                )}
              </div>

              <div className="mb-5 rounded-full bg-[#edf7f1] p-1">
              <div className="grid grid-cols-2 gap-1">
                {tabs.map(({ id, label, icone: Icone }) => {
                  const ativo = perfil === id;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPerfil(id)}
                      className={`flex items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition-all duration-200 ease-out ${
                        ativo ? 'bg-[#0f8b5f] text-white shadow-sm' : 'text-[#5d6f68] hover:bg-[#e5f4ee] hover:text-[#0f8b5f]'
                      }`}
                    >
                      <Icone className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1a2f2a]">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full rounded-xl border border-[#d7e2dd] bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:border-[#0f8b5f] focus:ring-2 focus:ring-[#0f8b5f]/20"
                  required
                />
              </div>

              <div>
                <label htmlFor="senha" className="mb-2 block text-sm font-medium text-[#1a2f2a]">Senha</label>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#d7e2dd] bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:border-[#0f8b5f] focus:ring-2 focus:ring-[#0f8b5f]/20"
                  required
                />
                <div className="mt-2 flex justify-end">
                  <Link to="/recuperar-senha" className="text-sm font-medium text-[#0f8b5f] transition-colors duration-200 ease-out hover:text-[#0b764e] hover:underline">
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>

              {erro && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{erro}</div>}

              <button
                type="submit"
                disabled={carregando}
                className="flex min-h-[52px] w-full items-center justify-center rounded-[22px] bg-gradient-to-r from-[#1ab76d] to-[#0f8b5f] px-4 py-3 text-base font-bold text-white transition-all duration-200 ease-out hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cadastro')}
                className="flex min-h-[52px] w-full items-center justify-center rounded-[22px] border-[2px] border-[#1b9a6b] bg-transparent text-base font-semibold text-[#0f8b5f] transition-all duration-200 ease-out hover:bg-[#effaf5]"
              >
                Criar conta
              </button>
            </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
