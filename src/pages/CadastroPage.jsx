import { useEffect, useRef, useState } from 'react';
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
  {
    campo: 'sintomasRecentes',
    tipo: 'multipla',
    texto: 'Nos últimos 30 dias, você sentiu algum destes sintomas?',
    opcoes: [
      { valor: 'cansaco', texto: 'Cansaço excessivo' },
      { valor: 'febre', texto: 'Febre' },
      { valor: 'dor_cabeca', texto: 'Dor de cabeça' },
      { valor: 'falta_ar', texto: 'Falta de ar' },
      { valor: 'sintomas_digestivos', texto: 'Sintomas digestivos' },
      { valor: 'nenhum_sintoma', texto: 'Nenhum desses sintomas' },
    ],
  },
  {
    campo: 'objetivoAtendimento',
    tipo: 'unica',
    texto: 'Qual é o seu principal objetivo ao usar a plataforma?',
    opcoes: [
      { valor: 'agendar_consultas', texto: 'Agendar consultas' },
      { valor: 'acompanhar_saude', texto: 'Acompanhar minha saúde' },
      { valor: 'segunda_opiniao', texto: 'Buscar uma segunda opinião' },
      { valor: 'obter_informacoes', texto: 'Obter informações sobre saúde' },
    ],
  },
];

const formatarCPF = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);

  if (apenasNumeros.length <= 3) return apenasNumeros;
  if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  if (apenasNumeros.length <= 9) {
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  }

  return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
};

const formatarTelefone = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 11);

  if (apenasNumeros.length <= 2) return apenasNumeros ? `(${apenasNumeros}` : '';
  if (apenasNumeros.length <= 7) return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  if (apenasNumeros.length <= 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  }

  const ddd = apenasNumeros.slice(0, 2);
  const restante = apenasNumeros.slice(2);
  const parte1 = restante.length > 0 ? restante.slice(0, 1) : '';
  const parte2 = restante.length > 1 ? restante.slice(1, 5) : '';
  const parte3 = restante.length > 5 ? restante.slice(5) : '';

  if (!parte3) {
    return `(${ddd}) ${parte1}${parte2 ? ` ${parte2}` : ''}`.trim();
  }

  return `(${ddd}) ${parte1} ${parte2}-${parte3}`;
};

const formatarDataNascimento = (valor) => {
  const apenasNumeros = valor.replace(/\D/g, '').slice(0, 8);

  if (apenasNumeros.length <= 2) return apenasNumeros;
  if (apenasNumeros.length <= 4) return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;

  return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4)}`;
};

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const cpfValido = (cpf) => {
  const numeros = cpf.replace(/\D/g, '');

  if (numeros.length !== 11 || /^([0-9])\1+$/.test(numeros)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i += 1) {
    soma += Number(numeros.charAt(i)) * (10 - i);
  }
  let primeiroDigito = 11 - (soma % 11);
  if (primeiroDigito >= 10) primeiroDigito = 0;

  if (Number(numeros.charAt(9)) !== primeiroDigito) return false;

  soma = 0;
  for (let i = 0; i < 10; i += 1) {
    soma += Number(numeros.charAt(i)) * (11 - i);
  }
  let segundoDigito = 11 - (soma % 11);
  if (segundoDigito >= 10) segundoDigito = 0;

  return Number(numeros.charAt(10)) === segundoDigito;
};

const validarTelefone = (telefone) => {
  const numero = telefone.replace(/\D/g, '');
  return /^\d{10,11}$/.test(numero);
};

const dataNascimentoValida = (data) => {
  if (!data || data.length !== 10) return false;

  const [dia, mes, ano] = data.split('/').map(Number);
  if (!dia || !mes || !ano) return false;

  const dataObj = new Date(ano, mes - 1, dia);
  return (
    dataObj.getFullYear() === ano &&
    dataObj.getMonth() === mes - 1 &&
    dataObj.getDate() === dia &&
    dataObj <= new Date()
  );
};

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
  const [errosCampos, setErrosCampos] = useState({});
  const [respostas, setRespostas] = useState([]);
  const [selecaoAtual, setSelecaoAtual] = useState([]);
  const [outraCondicao, setOutraCondicao] = useState('');
  const [consentimentoDadosSaude, setConsentimentoDadosSaude] = useState(false);
  const [erro, setErro] = useState('');
  const [carregandoCadastro, setCarregandoCadastro] = useState(false);
  const [digitando, setDigitando] = useState(false);
  const chatContainerRef = useRef(null);

  const atualizarCampo = (event) => {
    const { name, value } = event.target;

    let valorFormatado = value;
    if (name === 'cpf') valorFormatado = formatarCPF(value);
    if (name === 'telefone') valorFormatado = formatarTelefone(value);
    if (name === 'dataNascimento') valorFormatado = formatarDataNascimento(value);

    setForm((atual) => ({ ...atual, [name]: valorFormatado }));
    setErrosCampos((atual) => ({ ...atual, [name]: '' }));
    setErro('');
  };

  const validarDadosPessoa = () => {
    const validacoes = {};

    if (form.nome.trim().length < 2) {
      validacoes.nome = 'Informe seu nome completo.';
    }

    if (!cpfValido(form.cpf)) {
      validacoes.cpf = 'CPF inválido.';
    }

    if (!dataNascimentoValida(form.dataNascimento)) {
      validacoes.dataNascimento = 'Data de nascimento inválida.';
    }

    if (!validarTelefone(form.telefone)) {
      validacoes.telefone = 'Telefone inválido.';
    }

    if (!validarEmail(form.email)) {
      validacoes.email = 'E-mail inválido.';
    }

    if (form.senha.length < 6) {
      validacoes.senha = 'A senha deve ter no mínimo 6 caracteres.';
    }

    return validacoes;
  };

  const continuarParaSaude = (event) => {
    event.preventDefault();
    setErro('');

    const validacoes = validarDadosPessoa();
    setErrosCampos(validacoes);

    if (Object.keys(validacoes).length > 0) {
      setErro('Corrija os campos em destaque antes de continuar.');
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
          sintomasRecentes: respostas[3]?.valor ?? [],
          objetivoAtendimento: respostas[4]?.valor ?? null,
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
  const perguntaAtual = !questionarioConcluido ? perguntas[respostas.length] : null;

  useEffect(() => {
    if (etapa !== 2 || questionarioConcluido) {
      setDigitando(false);
      return undefined;
    }

    setDigitando(true);
    const temporizador = setTimeout(() => setDigitando(false), 1100);

    return () => clearTimeout(temporizador);
  }, [etapa, questionarioConcluido, respostas.length]);

  useEffect(() => {
    if (!chatContainerRef.current || etapa !== 2) return;

    const container = chatContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [etapa, respostas.length, digitando, questionarioConcluido]);

  return (
    <div className="min-h-screen bg-[#eef4f0] px-4 py-10">
      <main className="mx-auto max-w-[1180px]">
        {etapa === 1 ? (
          <div className="mx-auto max-w-[440px]">
            <section className="w-full rounded-[28px] border border-[#dfeae6] bg-white p-5 shadow-[0_18px_40px_rgba(18,44,32,0.08)] sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfeae6] bg-[#f7faf8] text-[#17332d] transition hover:border-[#0f8b5f] hover:text-[#0f8b5f]"
                  aria-label="Voltar para login"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex-1 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a6d68]">Passo 1 de 2</p>
                </div>
                <div className="h-2.5 w-20 overflow-hidden rounded-full bg-[#e7efe9]">
                  <div className="h-full w-1/2 rounded-full bg-[#0f8b5f]" />
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-[2rem] font-extrabold tracking-[-0.05em] text-[#15362d]">Criar conta</h2>
                <p className="mt-2 text-base text-[#5d6f68]">Dados pessoais</p>
              </div>

              <form onSubmit={continuarParaSaude} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="mb-2 block text-sm font-medium text-[#1a2f2a]">Nome completo</label>
                  <input
                    id="nome"
                    name="nome"
                    autoComplete="name"
                    value={form.nome}
                    onChange={atualizarCampo}
                    placeholder="Maria da Souza"
                    aria-invalid={Boolean(errosCampos.nome)}
                    className={`min-h-12 w-full rounded-xl border bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:ring-2 ${errosCampos.nome ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#d7e2dd] focus:border-[#0f8b5f] focus:ring-[#0f8b5f]/20'}`}
                  />
                  {errosCampos.nome && <p className="mt-1 text-xs text-red-600">{errosCampos.nome}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cpf" className="mb-2 block text-sm font-medium text-[#1a2f2a]">CPF</label>
                    <input
                      id="cpf"
                      name="cpf"
                      inputMode="numeric"
                      autoComplete="off"
                      value={form.cpf}
                      onChange={atualizarCampo}
                      placeholder="000.000.000-00"
                      aria-invalid={Boolean(errosCampos.cpf)}
                      className={`min-h-12 w-full rounded-xl border bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:ring-2 ${errosCampos.cpf ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#d7e2dd] focus:border-[#0f8b5f] focus:ring-[#0f8b5f]/20'}`}
                    />
                    {errosCampos.cpf && <p className="mt-1 text-xs text-red-600">{errosCampos.cpf}</p>}
                  </div>

                  <div>
                    <label htmlFor="dataNascimento" className="mb-2 block text-sm font-medium text-[#1a2f2a]">Data de nascimento</label>
                    <input
                      id="dataNascimento"
                      name="dataNascimento"
                      type="text"
                      inputMode="numeric"
                      autoComplete="bday"
                      value={form.dataNascimento}
                      onChange={atualizarCampo}
                      placeholder="DD/MM/AAAA"
                      aria-invalid={Boolean(errosCampos.dataNascimento)}
                      className={`min-h-12 w-full rounded-xl border bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:ring-2 ${errosCampos.dataNascimento ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#d7e2dd] focus:border-[#0f8b5f] focus:ring-[#0f8b5f]/20'}`}
                    />
                    {errosCampos.dataNascimento && <p className="mt-1 text-xs text-red-600">{errosCampos.dataNascimento}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="telefone" className="mb-2 block text-sm font-medium text-[#1a2f2a]">Telefone</label>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.telefone}
                    onChange={atualizarCampo}
                    placeholder="(81) 9 0000-0000"
                    aria-invalid={Boolean(errosCampos.telefone)}
                    className={`min-h-12 w-full rounded-xl border bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:ring-2 ${errosCampos.telefone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#d7e2dd] focus:border-[#0f8b5f] focus:ring-[#0f8b5f]/20'}`}
                  />
                  {errosCampos.telefone && <p className="mt-1 text-xs text-red-600">{errosCampos.telefone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1a2f2a]">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={atualizarCampo}
                    placeholder="seu@email.com"
                    aria-invalid={Boolean(errosCampos.email)}
                    className={`min-h-12 w-full rounded-xl border bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:ring-2 ${errosCampos.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#d7e2dd] focus:border-[#0f8b5f] focus:ring-[#0f8b5f]/20'}`}
                  />
                  {errosCampos.email && <p className="mt-1 text-xs text-red-600">{errosCampos.email}</p>}
                </div>

                <div>
                  <label htmlFor="senha" className="mb-2 block text-sm font-medium text-[#1a2f2a]">Senha</label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    autoComplete="new-password"
                    value={form.senha}
                    onChange={atualizarCampo}
                    placeholder="••••••••"
                    minLength={6}
                    aria-invalid={Boolean(errosCampos.senha)}
                    className={`min-h-12 w-full rounded-xl border bg-[#f7faf8] px-4 py-3 text-base text-[#17332d] outline-none transition placeholder:text-[#7a8a85] focus:ring-2 ${errosCampos.senha ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-[#d7e2dd] focus:border-[#0f8b5f] focus:ring-[#0f8b5f]/20'}`}
                  />
                  {errosCampos.senha && <p className="mt-1 text-xs text-red-600">{errosCampos.senha}</p>}
                </div>

                {erro && <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{erro}</p>}

                <button
                  type="submit"
                  className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f8b5f] px-6 py-3 text-base font-bold text-white transition hover:bg-[#0b764e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8b5f]"
                >
                  Continuar
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </form>
            </section>

          </div>
        ) : (
          <section className="mx-auto max-w-[780px] overflow-hidden rounded-[28px] border border-[#dfeae6] bg-white shadow-[0_18px_40px_rgba(18,44,32,0.08)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#eaf0ee] bg-[#f7faf8] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={voltar}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfeae6] bg-white text-[#17332d] transition hover:border-[#0f8b5f] hover:text-[#0f8b5f]"
                  aria-label="Voltar aos dados"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a6d68]">Passo 2 de 2</p>
                  <h2 className="mt-1 text-xl font-bold text-[#15362d]">Assistente de IA</h2>
                </div>
              </div>
              <div className="h-2.5 w-24 overflow-hidden rounded-full bg-[#e7efe9]">
                <div className="h-full w-full rounded-full bg-[#0f8b5f]" />
              </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-5 sm:px-8 sm:py-7">
              <div className="mb-5 flex items-center justify-between gap-3 text-sm font-semibold text-[#5a6d68]">
                <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-[#0f8b5f]" aria-hidden="true" /> Cadastro de saúde</span>
                <span>{Math.min(respostas.length + 1, perguntas.length)} de {perguntas.length}</span>
              </div>

              <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#e7efe9]" aria-hidden="true">
                <div className="h-full rounded-full bg-[#0f8b5f] transition-all duration-500" style={{ width: `${(respostas.length / perguntas.length) * 100}%` }} />
              </div>

              <div ref={chatContainerRef} className="max-h-[48vh] min-h-56 space-y-4 overflow-y-auto rounded-[24px] bg-[#f7faf8] p-4 sm:p-5" aria-live="polite" aria-relevant="additions">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[#0f8b5f]"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
                  <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#dfeae6] bg-white px-4 py-3 text-base leading-relaxed text-[#15362d]">
                    Olá, {form.nome.trim().split(/\s+/)[0] || 'que bom ter você aqui'}. Vou registrar algumas informações que você já conhece sobre sua saúde. Isso não é um diagnóstico.
                  </p>
                </div>

                {respostas.length === 0 && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[#0f8b5f]"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
                    {digitando ? (
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#dfeae6] bg-white px-4 py-3">
                        <div className="typing-dots" aria-label="Assistente digitando">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    ) : (
                      <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#dfeae6] bg-white px-4 py-3 text-base leading-relaxed text-[#15362d]">{perguntas[0].texto}</p>
                    )}
                  </div>
                )}

                {respostas.map((item, indice) => (
                  <div key={`${item.pergunta}-${indice}`}>
                    <div className="mb-3 flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#0f8b5f] px-4 py-3 text-base font-medium leading-relaxed text-white">{item.resposta}</p>
                    </div>
                    {indice + 1 < perguntas.length && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[#0f8b5f]"><HeartPulse className="h-5 w-5" aria-hidden="true" /></div>
                        {digitando && indice + 1 === respostas.length ? (
                          <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#dfeae6] bg-white px-4 py-3">
                            <div className="typing-dots" aria-label="Assistente digitando">
                              <span />
                              <span />
                              <span />
                            </div>
                          </div>
                        ) : (
                          <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#dfeae6] bg-white px-4 py-3 text-base leading-relaxed text-[#15362d]">{perguntas[indice + 1].texto}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {questionarioConcluido && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[#0f8b5f]"><Check className="h-5 w-5" aria-hidden="true" /></div>
                    <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#dfeae6] bg-white px-4 py-3 text-base leading-relaxed text-[#15362d]">Pronto. Suas respostas serão salvas na sua ficha quando você concluir o cadastro.</p>
                  </div>
                )}
              </div>

              {!questionarioConcluido && !digitando && perguntaAtual && (
                <div className="mt-5" aria-label={`Opções para: ${perguntaAtual.texto}`}>
                  <p className="mb-3 text-base font-semibold text-[#15362d]">
                    {perguntaAtual.tipo === 'multipla' ? 'Marque todas as opções que se aplicam' : 'Escolha uma opção'}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {perguntaAtual.opcoes.map((opcao) => (
                      <button
                        key={opcao.valor}
                        type="button"
                        onClick={() => alternarSelecao(opcao.valor)}
                        aria-pressed={perguntaAtual.tipo === 'multipla' ? selecaoAtual.includes(opcao.valor) : undefined}
                        className={`flex min-h-14 items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8b5f] ${selecaoAtual.includes(opcao.valor) ? 'border-[#0f8b5f] bg-[#eaf6f0] text-[#15362d]' : 'border-[#d7e2dd] bg-white text-[#15362d] hover:border-[#0f8b5f] hover:bg-[#f2faf6]'}`}
                      >
                        {opcao.texto}
                        {selecaoAtual.includes(opcao.valor)
                          ? <Check className="h-5 w-5 shrink-0 text-[#0f8b5f]" aria-hidden="true" />
                          : <ArrowRight className="h-5 w-5 shrink-0 text-[#0f8b5f]" aria-hidden="true" />}
                      </button>
                    ))}
                  </div>
                  {perguntaAtual.campo === 'condicoesConhecidas' && selecaoAtual.includes('outra_condicao') && (
                    <div className="mt-4">
                      <label htmlFor="outraCondicao" className="mb-2 block text-base font-semibold text-[#15362d]">Se quiser, informe qual é (opcional)</label>
                      <input
                        id="outraCondicao"
                        maxLength={120}
                        value={outraCondicao}
                        onChange={(event) => setOutraCondicao(event.target.value)}
                        className="min-h-12 w-full rounded-xl border border-[#d7e2dd] bg-white px-4 py-3 text-base text-[#17332d] outline-none transition focus:border-[#0f8b5f] focus:ring-2 focus:ring-[#0f8b5f]/20"
                      />
                    </div>
                  )}
                  {perguntaAtual.tipo === 'multipla' && (
                    <button
                      type="button"
                      onClick={continuarPerguntaMultipla}
                      className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f8b5f] px-5 py-3 text-base font-bold text-white transition hover:bg-[#0b764e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8b5f] sm:w-auto"
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
                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#d7e2dd] bg-[#f7faf8] p-4 text-base leading-relaxed text-[#15362d]">
                  <input
                    type="checkbox"
                    checked={consentimentoDadosSaude}
                    onChange={(event) => setConsentimentoDadosSaude(event.target.checked)}
                    className="mt-1 h-5 w-5 shrink-0 accent-[#0F8B5F]"
                  />
                  <span>Autorizo salvar estas informações de saúde na minha ficha para apoiar meu atendimento.</span>
                </label>
              )}

              {questionarioConcluido && (
                <div className="mt-6 flex justify-end border-t border-[#eaf0ee] pt-5">
                  <button
                    type="button"
                    onClick={concluirCadastro}
                    disabled={carregandoCadastro || !consentimentoDadosSaude}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f8b5f] px-6 py-3 text-base font-bold text-white transition hover:bg-[#0b764e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f8b5f] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
                  >
                    {carregandoCadastro ? 'Criando sua conta...' : 'Concluir cadastro'}
                    {!carregandoCadastro && <Check className="h-5 w-5" aria-hidden="true" />}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CadastroPage;