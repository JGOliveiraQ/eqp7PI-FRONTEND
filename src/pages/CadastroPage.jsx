import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const perguntas = [
  {
    campo: 'condicoesConhecidas',
    tipo: 'multipla',
    texto: 'Algum profissional de saúde já informou que você tem alguma destas condições?',
    opcoes: [
      { valor: 'hipertensao', texto: 'Pressão alta (hipertensão)' },
      { valor: 'diabetes', texto: 'Diabetes' },
      { valor: 'colesterol_alto', texto: 'Colesterol alto' },
      { valor: 'asma_bronquite', texto: 'Asma ou bronquite' },
      { valor: 'doenca_cardiaca', texto: 'Doença do coração' },
      { valor: 'outra_condicao', texto: 'Outra condição' },
      { valor: 'nenhuma_listada', texto: 'Nenhuma dessas condições' },
      { valor: 'nao_sei', texto: 'Não sei informar' },
    ],
  },
  {
    campo: 'usoMedicacaoContinua',
    tipo: 'unica',
    texto: 'Você usa algum medicamento de forma contínua?',
    opcoes: [
      { valor: 'sim', texto: 'Sim' },
      { valor: 'nao', texto: 'Não' },
      { valor: 'nao_sei', texto: 'Não sei informar' },
    ],
  },
  {
    campo: 'alergiasMedicamentos',
    tipo: 'unica',
    texto: 'Você tem alguma alergia conhecida a medicamentos?',
    opcoes: [
      { valor: 'sim', texto: 'Sim' },
      { valor: 'nao', texto: 'Não' },
      { valor: 'nao_sei', texto: 'Não sei informar' },
    ],
  },
];

function CadastroPage() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    senha: '',
  });
  const [respostas, setRespostas] = useState([]);
  const [selecaoAtual, setSelecaoAtual] = useState([]);
  const [outraCondicao, setOutraCondicao] = useState('');
  const [consentimentoDadosSaude, setConsentimentoDadosSaude] = useState(false);
  const [erro, setErro] = useState('');
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);

  const atualizarCampo = (event) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const continuarParaSaude = (event) => {
    event.preventDefault();
    setErro('');

    if (!form.nome.trim() || !form.cpf.trim() || !form.email.trim() || !form.senha.trim()) {
      setErro('Preencha nome, CPF, e-mail e senha para continuar.');
      return;
    }

    if (form.senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setEtapa(2);
  };

  const salvarResposta = (resposta, valor) => {
    const perguntaAtual = perguntas[respostas.length];
    setRespostas((atuais) => [...atuais, {
      campo: perguntaAtual.campo,
      pergunta: perguntaAtual.texto,
      resposta,
      valor,
    }]);
    setSelecaoAtual([]);
    setErro('');
  };

  const alternarSelecao = (valor) => {
    const perguntaAtual = perguntas[respostas.length];
    const opcoesExclusivas = ['nenhuma_listada', 'nao_sei'];

    setSelecaoAtual((atuais) => {
      if (opcoesExclusivas.includes(valor)) {
        return atuais.includes(valor) ? [] : [valor];
      }

      const condicoes = atuais.filter((item) => !opcoesExclusivas.includes(item));
      return condicoes.includes(valor)
        ? condicoes.filter((item) => item !== valor)
        : [...condicoes, valor];
    });
    setErro('');

    if (perguntaAtual.tipo !== 'multipla') {
      const opcao = perguntaAtual.opcoes.find((item) => item.valor === valor);
      salvarResposta(opcao.texto, valor);
    }
  };

  const continuarPerguntaMultipla = () => {
    if (selecaoAtual.length === 0) {
      setErro('Selecione uma ou mais condições, ou escolha uma das opções de resposta.');
      return;
    }

    const perguntaAtual = perguntas[respostas.length];
    const textosSelecionados = selecaoAtual.map((valor) => (
      perguntaAtual.opcoes.find((opcao) => opcao.valor === valor)?.texto
    ));
    salvarResposta(textosSelecionados.join(', '), selecaoAtual);
  };

  const concluirCadastro = async () => {
    setErro('');
    setCarregandoCadastro(true);

    try {
      await cadastrar({
        nome: form.nome,
        cpf: form.cpf,
        dataNascimento: form.dataNascimento,
        telefone: form.telefone,
        email: form.email,
        senha: form.senha,
        dadosSaude: {
          condicoesConhecidas: respostas[0].valor.filter((valor) => !['nenhuma_listada', 'nao_sei'].includes(valor)),
          situacaoCondicoes: respostas[0].valor.includes('nenhuma_listada')
            ? 'nenhuma_listada'
            : respostas[0].valor.includes('nao_sei')
              ? 'nao_sei'
              : 'informadas',
          outraCondicao,
          usoMedicacaoContinua: respostas[1].valor,
          alergiasMedicamentos: respostas[2].valor,
        },
        consentimentoDadosSaude: true,
      });
      navigate('/cadastro/sucesso');
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setCarregandoCadastro(false);
    }
  };

  const voltar = () => {
    setErro('');
    setEtapa((atual) => Math.max(1, atual - 1));
  };

  const questionarioConcluido = respostas.length === perguntas.length;

  return (
    <div className="min-h-screen bg-[#F1F7F4] pb-10">
      <header className="relative overflow-hidden bg-saude-primary text-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-white/10 bg-white/[0.04] md:block" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-4 pb-7 pt-5 sm:px-8 sm:pb-9 sm:pt-7">
          <div className="flex items-center gap-3">
            {etapa === 1 ? (
              <Link
                to="/login"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Voltar para login"
              >
                <ArrowLeft className="h-6 w-6" aria-hidden="true" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={voltar}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Voltar aos dados pessoais"
              >
                <ArrowLeft className="h-6 w-6" aria-hidden="true" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/85">Saúde Recife <span aria-hidden="true">/</span> Criar conta</p>
              <h1 className="mt-0.5 text-xl font-bold sm:text-2xl">
                {etapa === 1 ? 'Seus dados pessoais' : 'Seu histórico de saúde'}
              </h1>
            </div>
            <div className="shrink-0 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-bold" aria-label={`Etapa ${etapa} de 2`}>
              {etapa}/2
            </div>
          </div>

          <div className="mt-6" aria-label={`Progresso do cadastro: etapa ${etapa} de 2`}>
            <div className="mb-2 flex justify-between text-sm font-medium text-white/90">
              <span>Etapa {etapa} de 2</span>
              <span>{etapa === 1 ? 'Dados da conta' : 'Informações de saúde'}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/20">
              <div className={`h-full rounded-full bg-white transition-all duration-500 ${etapa === 1 ? 'w-1/2' : 'w-full'}`} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto -mt-3 max-w-5xl px-4 sm:px-8">
        {etapa === 1 ? (
          <section className="rounded-2xl border border-[#D7E6DE] bg-white p-5 shadow-[0_12px_32px_rgba(15,71,50,0.08)] sm:p-8">
            <div className="mb-7 flex items-start gap-4 border-b border-[#E7EFEB] pb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F4EA] text-saude-primary">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-saude-primary">PRIMEIRO, SEUS DADOS</p>
                <h2 className="mt-1 text-2xl font-bold text-saude-darkText">Vamos criar sua conta</h2>
                <p className="mt-1 text-base text-saude-secondaryText">Preencha as informações para começar.</p>
              </div>
            </div>

            <form onSubmit={continuarParaSaude} className="space-y-5">
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="nome" className="mb-2 block text-base font-semibold text-saude-darkText">Nome completo</label>
                  <input
                    id="nome"
                    name="nome"
                    autoComplete="name"
                    value={form.nome}
                    onChange={atualizarCampo}
                    placeholder="Ex.: Maria da Silva"
                    required
                    className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition placeholder:text-[#78877F] focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="cpf" className="mb-2 block text-base font-semibold text-saude-darkText">CPF</label>
                  <input
                    id="cpf"
                    name="cpf"
                    inputMode="numeric"
                    autoComplete="off"
                    value={form.cpf}
                    onChange={atualizarCampo}
                    placeholder="000.000.000-00"
                    required
                    className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition placeholder:text-[#78877F] focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="dataNascimento" className="mb-2 block text-base font-semibold text-saude-darkText">Data de nascimento</label>
                  <input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    autoComplete="bday"
                    value={form.dataNascimento}
                    onChange={atualizarCampo}
                    className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="telefone" className="mb-2 block text-base font-semibold text-saude-darkText">Telefone</label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.telefone}
                    onChange={atualizarCampo}
                    placeholder="(81) 99999-9999"
                    className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition placeholder:text-[#78877F] focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-base font-semibold text-saude-darkText">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={atualizarCampo}
                    placeholder="seu@email.com"
                    required
                    className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition placeholder:text-[#78877F] focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="senha" className="mb-2 block text-base font-semibold text-saude-darkText">Crie uma senha</label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    value={form.senha}
                    onChange={atualizarCampo}
                    placeholder="Pelo menos 6 caracteres"
                    minLength={6}
                    required
                    className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition placeholder:text-[#78877F] focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                  />
                </div>
              </div>

              {erro && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-base font-medium text-red-800">{erro}</p>}

              <div className="flex flex-col-reverse gap-3 border-t border-[#E7EFEB] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-saude-secondaryText">Já tem uma conta? <Link to="/login" className="font-semibold text-saude-primary underline underline-offset-2">Entrar</Link></p>
                <button
                  type="submit"
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-saude-primary px-6 py-3 text-base font-bold text-white transition hover:bg-saude-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saude-primary sm:w-auto"
                >
                  Continuar para informações de saúde
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-[#D7E6DE] bg-white shadow-[0_12px_32px_rgba(15,71,50,0.08)]">
            <div className="flex items-start gap-4 border-b border-[#E7EFEB] bg-[#F7FBF8] px-5 py-5 sm:px-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-saude-primary text-white">
                <HeartPulse className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-saude-darkText">Informações do seu histórico de saúde</h2>
                <p className="mt-1 text-base text-saude-secondaryText">Vamos registrar condições já conhecidas para compor sua ficha de paciente.</p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mb-5 flex items-center justify-between gap-3 text-sm font-semibold text-saude-secondaryText">
                <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-saude-primary" aria-hidden="true" /> Cadastro de saúde</span>
                <span>{Math.min(respostas.length + 1, perguntas.length)} de {perguntas.length}</span>
              </div>
              <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#E7EFEB]" aria-hidden="true">
                <div className="h-full rounded-full bg-saude-primary transition-all duration-500" style={{ width: `${(respostas.length / perguntas.length) * 100}%` }} />
              </div>

              <div className="max-h-[42vh] min-h-56 space-y-4 overflow-y-auto rounded-xl bg-[#F7FAF8] p-4 sm:max-h-[48vh] sm:p-5" aria-live="polite" aria-relevant="additions">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DFF2E7] text-saude-primary"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#DFE9E3] bg-white px-4 py-3 text-base leading-relaxed text-saude-darkText">
                    Olá, {form.nome.trim().split(/\s+/)[0] || 'que bom ter você aqui'}. Vou registrar algumas informações que você já conhece sobre sua saúde. Isso não é um diagnóstico.
                  </p>
                </div>

                {respostas.length === 0 && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DFF2E7] text-saude-primary"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#DFE9E3] bg-white px-4 py-3 text-base leading-relaxed text-saude-darkText">{perguntas[0].texto}</p>
                  </div>
                )}

                {respostas.map((item, indice) => (
                  <div key={`${item.pergunta}-${indice}`}>
                    <div className="mb-3 flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-saude-primary px-4 py-3 text-base font-medium leading-relaxed text-white">{item.resposta}</p>
                    </div>
                    {indice + 1 < perguntas.length && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DFF2E7] text-saude-primary"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
                        <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#DFE9E3] bg-white px-4 py-3 text-base leading-relaxed text-saude-darkText">{perguntas[indice + 1].texto}</p>
                      </div>
                    )}
                  </div>
                ))}

                {questionarioConcluido && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DFF2E7] text-saude-primary"><Check className="h-5 w-5" aria-hidden="true" /></div>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#DFE9E3] bg-white px-4 py-3 text-base leading-relaxed text-saude-darkText">Pronto. Suas respostas serão salvas na sua ficha quando você concluir o cadastro.</p>
                  </div>
                )}
              </div>

              {!questionarioConcluido && (
                <div className="mt-5" aria-label={`Opções para: ${perguntas[respostas.length].texto}`}>
                  <p className="mb-3 text-base font-semibold text-saude-darkText">
                    {perguntas[respostas.length].tipo === 'multipla' ? 'Marque todas as opções que se aplicam' : 'Escolha uma opção'}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {perguntas[respostas.length].opcoes.map((opcao) => (
                      <button
                        key={opcao.valor}
                        type="button"
                        onClick={() => alternarSelecao(opcao.valor)}
                        aria-pressed={perguntas[respostas.length].tipo === 'multipla' ? selecaoAtual.includes(opcao.valor) : undefined}
                        className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saude-primary ${selecaoAtual.includes(opcao.valor) ? 'border-saude-primary bg-[#EAF5EF] text-saude-darkText' : 'border-[#C9D8D0] bg-white text-saude-darkText hover:border-saude-primary hover:bg-[#F1F8F4]'}`}
                      >
                        {opcao.texto}
                        {selecaoAtual.includes(opcao.valor)
                          ? <Check className="h-5 w-5 shrink-0 text-saude-primary" aria-hidden="true" />
                          : <ArrowRight className="h-5 w-5 shrink-0 text-saude-primary" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                  {perguntas[respostas.length].campo === 'condicoesConhecidas' && selecaoAtual.includes('outra_condicao') && (
                    <div className="mt-4">
                      <label htmlFor="outraCondicao" className="mb-2 block text-base font-semibold text-saude-darkText">Se quiser, informe qual é (opcional)</label>
                      <input
                        id="outraCondicao"
                        maxLength={120}
                        value={outraCondicao}
                        onChange={(event) => setOutraCondicao(event.target.value)}
                        className="min-h-14 w-full rounded-xl border border-[#C9D8D0] bg-white px-4 py-3 text-base text-saude-darkText outline-none transition focus:border-saude-primary focus:ring-2 focus:ring-saude-primary/20"
                      />
                    </div>
                  )}
                  {perguntas[respostas.length].tipo === 'multipla' && (
                    <button
                      type="button"
                      onClick={continuarPerguntaMultipla}
                      className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-saude-primary px-5 py-3 text-base font-bold text-white transition hover:bg-saude-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saude-primary sm:w-auto"
                    >Continuar <ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
                  )}
                </div>
              )}

              {erro && (
                <div className="mt-5" role="alert">
                  <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-base font-medium text-red-800">{erro}</p>
                </div>
              )}

              {questionarioConcluido && (
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#C9D8D0] bg-[#F7FBF8] p-4 text-base leading-relaxed text-saude-darkText">
                  <input
                    type="checkbox"
                    checked={consentimentoDadosSaude}
                    onChange={(event) => setConsentimentoDadosSaude(event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#0F8B5F]"
                  />
                  <span>Autorizo salvar estas informações de saúde na minha ficha para apoiar meu atendimento.</span>
                </label>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#E7EFEB] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={voltar}
                  className="flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-2 text-base font-semibold text-saude-primary hover:bg-[#F1F8F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saude-primary"
                ><ArrowLeft className="h-5 w-5" aria-hidden="true" /> Voltar aos dados</button>
                {questionarioConcluido && (
                  <button
                    type="button"
                    onClick={concluirCadastro}
                    disabled={carregandoCadastro || !consentimentoDadosSaude}
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-saude-primary px-6 py-3 text-base font-bold text-white transition hover:bg-saude-primaryHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saude-primary disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    {carregandoCadastro ? 'Criando sua conta...' : 'Concluir cadastro'}
                    {!carregandoCadastro && <Check className="h-5 w-5" aria-hidden="true" />}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CadastroPage;