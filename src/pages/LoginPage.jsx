import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, HeartPulse, ShieldCheck, UserRound, Stethoscope } from 'lucide-react';
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
  const [avisoSenha, setAvisoSenha] = useState('');
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
    <div className="min-h-screen bg-saude-background">
      <header className="bg-saude-primary px-4 pb-28 pt-8 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
              {!logoFalhou ? (
                <img src="/logo-saude-recife.png" alt="Logo Saúde Recife" className="h-full w-full object-contain" onError={() => setLogoFalhou(true)} />
              ) : (
                <HeartPulse className="h-6 w-6 text-saude-primary" />
              )}
            </div>
            <div>
              <p className="text-sm opacity-90">Sistema de Saúde</p>
              <h1 className="text-2xl font-bold">Saúde Recife</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-20 max-w-md px-4 pb-10">
        <div className="rounded-card bg-white shadow-xl ring-1 ring-saude-border">
          <div className="border-b border-saude-border p-5">
            <div className="flex rounded-full bg-saude-light p-1">
              {tabs.map(({ id, label, icone: Icone }) => {
                const ativo = perfil === id;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPerfil(id)}
                    className={`flex w-1/2 items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition-all ${
                      ativo ? 'bg-white text-saude-primary shadow-sm' : 'text-saude-secondaryText'
                    }`}
                  >
                    <Icone className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-saude-darkText">E-mail</label>
              <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20" required />
            </div>

            <div>
              <label htmlFor="senha" className="mb-2 block text-sm font-medium text-saude-darkText">Senha</label>
              <input id="senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20" required />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setAvisoSenha('A recuperação de senha estará disponível em breve.')}
                  className="text-sm font-medium text-saude-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            {erro && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{erro}</div>}
            {avisoSenha && <div className="rounded-xl border border-saude-border bg-saude-light px-3 py-2 text-sm font-medium text-saude-darkText">{avisoSenha}</div>}

            <button type="submit" disabled={carregando} className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-saude-primary px-4 py-3 text-base font-bold text-white transition hover:bg-saude-primaryHover disabled:cursor-not-allowed disabled:opacity-70">
              {carregando ? 'Entrando...' : 'Entrar'}
              {!carregando && <ArrowRight className="h-4 w-4" />}
            </button>

            <div className="flex items-center justify-center gap-2 pt-2 text-sm text-saude-secondaryText">
              <ShieldCheck className="h-4 w-4 text-saude-primary" />
              <span>Dados protegidos e seguros</span>
            </div>

            <Link to="/cadastro" className="flex min-h-[52px] w-full items-center justify-center rounded-xl border border-saude-primary bg-white px-4 py-3 text-base font-bold text-saude-primary transition hover:bg-saude-light">
              Criar conta gratuita
            </Link>
          </form>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
