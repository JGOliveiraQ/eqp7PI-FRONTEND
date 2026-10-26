import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserRound, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const tabs = [
  { id: 'paciente', label: 'Paciente', icone: UserRound },
  { id: 'medico', label: 'Profissional', icone: Stethoscope },
  { id: 'admin', label: 'Admin', icone: null },
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
          await login(email.trim(), senha, perfil);
          navigate(perfil === 'admin' ? '/admin' : perfil === 'medico' ? '/profissional' : '/');
        } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f5] px-3 py-8 sm:px-4 lg:px-6">
      <main className="mx-auto flex max-w-[1250px] items-center justify-center">
        <div className="grid w-full max-w-[1140px] gap-5 lg:grid-cols-[0.92fr]">
          <div className="mx-auto flex w-full max-w-[420px] items-center justify-center rounded-[28px] bg-[#f7faf8] p-5 shadow-[0_4px_12px_rgba(18,44,32,0.04)] sm:p-7 lg:max-w-none">
            <div className="w-full">
              <div className="mb-5 flex justify-center">
                {!logoFalhou ? (
                  <img
                    src="/logocompacta.png"
                    alt="Logo compacta Saúde Recife"
                    className="h-16 w-auto object-contain drop-shadow-sm sm:h-20"
                    onError={() => setLogoFalhou(true)}
                  />
                ) : (
                  <span className="text-lg font-extrabold text-[#0d7f57]">Saúde Recife</span>
                )}
              </div>

              <div className="mb-5 rounded-full bg-[#edf7f1] p-1">
              <div className="grid grid-cols-3 gap-1">
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
                      {Icone && <Icone className="h-4 w-4" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1a2f2a]">
                                {perfil === 'medico' ? 'E-mail profissional' : perfil === 'admin' ? 'E-mail administrativo' : 'CPF ou E-mail'}
                              </label>
                              <input
                                id="email"
                                type={perfil === 'paciente' ? 'text' : 'email'}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder={perfil === 'medico' ? 'medico@sauderecife.com' : perfil === 'admin' ? 'admin@sauderecife.com' : '000.000.000-00 ou seu e-mail'}
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

              <p className="mt-3 text-center text-[12px] leading-5 text-[#5d706b]">
                Ao continuar, você concorda com os <span className="font-semibold text-[#0f8b5f]">Termos de Uso</span> e{' '}
                <span className="font-semibold text-[#0f8b5f]">Política de Privacidade</span>
              </p>
            </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
