import { useState } from 'react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function RecuperarSenhaPage() {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valor = identificador.trim();

    if (!valor) {
      setErro('Informe seu e-mail ou CPF.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      await api.post('/auth/recuperar-senha', { identificador: valor });
    } catch (error) {
      const endpointIndisponivel = !error.response || [404, 501].includes(error.response.status);

      if (!endpointIndisponivel) {
        setErro(error.response?.data?.message || 'Não foi possível solicitar a recuperação agora.');
        setLoading(false);
        return;
      }
    }

    setEnviado(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-saude-secondaryText transition hover:text-saude-primary"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>

        <section className="rounded-card bg-white p-5 shadow-xl ring-1 ring-saude-border sm:p-6">
          <header className="mb-7">
            <h1 className="text-3xl font-bold leading-tight text-saude-darkText">Recuperar senha</h1>
            <p className="mt-2 text-base leading-6 text-saude-secondaryText">
              Informe seu e-mail ou CPF e enviaremos as instruções.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="identificador" className="mb-2 block text-sm font-medium text-saude-darkText">
                E-mail ou CPF
              </label>
              <input
                id="identificador"
                type="text"
                value={identificador}
                onChange={(event) => setIdentificador(event.target.value)}
                placeholder="maria@email.com"
                className="min-h-[52px] w-full rounded-2xl border border-saude-border bg-saude-background px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                autoComplete="email"
                required
              />
            </div>

            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-saude-primary px-4 py-3 font-bold text-white transition hover:bg-saude-primaryHover disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <LoaderCircle className="h-5 w-5 animate-spin" />}
              {loading ? 'Enviando...' : 'Solicitar recuperação'}
            </button>
          </form>

          {enviado && (
            <div className="mt-5 rounded-2xl border border-saude-primary/20 bg-saude-light p-4" role="status">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-saude-primary text-lg font-bold text-white">
                  ✓
                </span>
                <div>
                  <h2 className="font-bold text-saude-primary">Solicitação enviada</h2>
                  <p className="mt-1 text-sm text-saude-secondaryText">Confira seu e-mail para continuar.</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default RecuperarSenhaPage;
