import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function CadastroPage() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    senha: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    if (!form.nome.trim() || !form.cpf.trim() || !form.email.trim() || !form.senha.trim()) {
      return 'Preencha todos os campos obrigatórios.';
    }

    if (form.senha.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');

    const mensagemErro = validarFormulario();
    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    setCarregando(true);

    try {
      await cadastrar({
        nome: form.nome,
        cpf: form.cpf,
        dataNascimento: form.dataNascimento,
        telefone: form.telefone,
        email: form.email,
        senha: form.senha,
      });

      navigate('/cadastro/sucesso');
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-saude-background">
      <header className="bg-saude-primary px-4 py-5 text-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Link
            to="/login"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/15"
            aria-label="Voltar para login"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex-1">
            <p className="text-sm opacity-90">Crie sua conta</p>
            <h1 className="text-xl font-bold">Passo 1 de 2</h1>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-white/90">
            <span className="rounded-full bg-white/15 px-2 py-1">1/2</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-card bg-white p-5 shadow-md ring-1 ring-saude-border sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-saude-primary">Dados pessoais</p>
            <h2 className="mt-2 text-2xl font-bold text-saude-darkText">Informações do paciente</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="nome" className="mb-2 block text-sm font-medium text-saude-darkText">
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex.: Maria da Silva"
                  className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="mb-2 block text-sm font-medium text-saude-darkText">
                  CPF
                </label>
                <input
                  id="cpf"
                  name="cpf"
                  value={form.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                />
              </div>

              <div>
                <label htmlFor="dataNascimento" className="mb-2 block text-sm font-medium text-saude-darkText">
                  Data de Nascimento
                </label>
                <input
                  id="dataNascimento"
                  name="dataNascimento"
                  type="date"
                  value={form.dataNascimento}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="mb-2 block text-sm font-medium text-saude-darkText">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(81) 99999-9999"
                  className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-saude-darkText">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="senha" className="mb-2 block text-sm font-medium text-saude-darkText">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  value={form.senha}
                  onChange={handleChange}
                  placeholder="Crie uma senha segura"
                  className="w-full rounded-xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                />
              </div>
            </div>

            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-saude-primary px-4 py-3 text-base font-bold text-white transition hover:bg-saude-primaryHover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {carregando ? 'Cadastrando...' : 'Continuar'}
              {!carregando && <ChevronRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CadastroPage;
