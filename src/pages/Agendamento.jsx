import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Home,
  ShieldCheck,
} from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'
import { profissionais } from '../data/mockData'
import { agendarConsulta } from '../services/api'

const horariosPadrao = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

function gerarProximosDias() {
  const dias = []
  const hoje = new Date()
  let offset = 1

  while (dias.length < 4) {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() + offset)
    const diaSemana = data.getDay()

    if (diaSemana !== 0 && diaSemana !== 6) {
      const ano = data.getFullYear()
      const mes = String(data.getMonth() + 1).padStart(2, '0')
      const dia = String(data.getDate()).padStart(2, '0')
      const iso = `${ano}-${mes}-${dia}`

      const formatador = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
      const nomeDia = formatador.format(data).replace('.', '')

      dias.push({
        iso,
        dataFormatada: `${dia}/${mes}`,
        diaSemana: nomeDia.charAt(0).toUpperCase() + nomeDia.slice(1),
      })
    }
    offset += 1
  }

  return dias
}

function Agendamento() {
  const navigate = useNavigate()
  const { modoIdoso } = useAcessibilidade()

  const diasDisponiveis = useMemo(() => gerarProximosDias(), [])

  const [profissional] = useState(profissionais[0])
  const [dataSelecionada, setDataSelecionada] = useState(diasDisponiveis[0]?.iso || '')
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erroConflito, setErroConflito] = useState('')
  const [erroGeral, setErroGeral] = useState('')
  const [comprovante, setComprovante] = useState(null)

  const tamanhoTitulo = modoIdoso ? 'text-idoso-xl font-black' : 'text-2xl font-bold'
  const tamanhoSubtitulo = modoIdoso ? 'text-idoso-lg font-bold' : 'text-lg font-semibold'
  const tamanhoTexto = modoIdoso ? 'text-idoso-base' : 'text-base'

  const dataFormatadaExibicao = useMemo(() => {
    if (!dataSelecionada) return ''
    const [ano, mes, dia] = dataSelecionada.split('-')
    return `${dia}/${mes}/${ano}`
  }, [dataSelecionada])

  const selecionarHorario = (horario) => {
    setHorarioSelecionado(horario)
    setErroConflito('')
    setErroGeral('')
  }

  const handleConfirmarAgendamento = async (e) => {
    e.preventDefault()

    if (!dataSelecionada || !horarioSelecionado) return

    setCarregando(true)
    setErroConflito('')
    setErroGeral('')

    try {
      const dataHoraISO = new Date(`${dataSelecionada}T${horarioSelecionado}:00`).toISOString()

      const payload = {
        profissionalId: profissional.id,
        clinicaId: profissional.clinicaId,
        dataHora: dataHoraISO,
      }

      const resposta = await agendarConsulta(payload)
      setComprovante(resposta)
    } catch (erro) {
      if (erro.response?.status === 409) {
        setErroConflito('Este horário acabou de ser preenchido. Por favor, escolha outro horário.')
        setHorarioSelecionado('')
      } else {
        setErroGeral(erro.response?.data?.message || 'Falha ao confirmar o agendamento. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  if (comprovante) {
    return (
      <div className="min-h-screen bg-recife-light/40">
        <header className="bg-recife-primary text-white px-4 py-5 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className={tamanhoTitulo}>Comprovante de Agendamento</h1>
            <ShieldCheck size={modoIdoso ? 36 : 28} />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-md border border-green-200 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center text-recife-primary mb-3">
                <CheckCircle2 size={modoIdoso ? 48 : 40} />
              </div>
              <h2 className={`text-recife-dark ${tamanhoTitulo}`}>Consulta Agendada com Sucesso!</h2>
              <p className={`text-gray-600 mt-1 ${tamanhoTexto}`}>
                Protocolo:{' '}
                <span className="font-mono font-bold text-gray-800">
                  {comprovante._id || comprovante.id || 'REC-849201'}
                </span>
              </p>
            </div>

            <dl className={`space-y-4 ${tamanhoTexto}`}>
              <div className="bg-recife-light/50 rounded-xl p-4 border border-recife-accent/20">
                <dt className="text-gray-500 font-medium">Médico(a) Responsável</dt>
                <dd className="font-bold text-gray-900 mt-0.5">{profissional.nome}</dd>
                <dd className="text-gray-600">{profissional.crm} • {profissional.especialidade}</dd>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <dt className="text-gray-500 font-medium">Local da Consulta</dt>
                <dd className="font-bold text-gray-900 mt-0.5">{profissional.clinicaNome}</dd>
                <dd className="text-gray-600">{profissional.endereco}</dd>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center justify-between">
                <div>
                  <dt className="text-gray-500 font-medium">Data e Horário</dt>
                  <dd className={`font-black text-recife-dark ${tamanhoSubtitulo}`}>
                    {dataFormatadaExibicao} às {horarioSelecionado}
                  </dd>
                </div>
                <div className="bg-recife-primary text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Confirmado
                </div>
              </div>
            </dl>

            <div className={`p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl ${tamanhoTexto}`}>
              <p className="font-semibold text-amber-900">Orientações para o comparecimento:</p>
              <ul className="list-disc list-inside mt-2 text-amber-800 space-y-1">
                <li>Chegue com 15 minutos de antecedência.</li>
                <li>Leve seu documento oficial com foto e o Cartão SUS.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className={`w-full bg-recife-primary hover:bg-recife-dark text-white font-bold rounded-xl py-4 flex items-center justify-center gap-3 transition-colors shadow-md ${
                modoIdoso ? 'text-idoso-lg min-h-[64px]' : 'text-lg min-h-[52px]'
              }`}
            >
              <Home size={modoIdoso ? 28 : 22} />
              Voltar ao Início
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-recife-primary text-white px-4 py-5 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link
            to="/"
            className="p-2 -ml-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft size={modoIdoso ? 32 : 24} />
          </Link>
          <h1 className={tamanhoTitulo}>Escolha de Data e Horário</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {erroConflito && (
          <div
            role="alert"
            className={`bg-red-50 border-2 border-red-600 rounded-2xl p-5 shadow-sm flex items-start gap-4 animate-shake ${tamanhoTexto}`}
          >
            <AlertTriangle className="text-red-600 shrink-0 mt-1" size={modoIdoso ? 36 : 28} />
            <div>
              <h2 className="font-black text-red-950">Atenção</h2>
              <p className="text-red-900 font-semibold mt-1">{erroConflito}</p>
            </div>
          </div>
        )}

        {erroGeral && (
          <div
            role="alert"
            className={`bg-amber-50 border-2 border-amber-500 rounded-2xl p-4 flex items-start gap-3 ${tamanhoTexto}`}
          >
            <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={modoIdoso ? 32 : 24} />
            <p className="text-amber-900 font-medium">{erroGeral}</p>
          </div>
        )}

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
          <h2 className={`text-gray-900 ${tamanhoSubtitulo}`}>Profissional e Local Selecionados</h2>

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-recife-light rounded-2xl flex items-center justify-center text-recife-primary shrink-0">
              <User size={modoIdoso ? 34 : 28} />
            </div>
            <div className="space-y-1">
              <h3 className={`font-bold text-recife-dark ${modoIdoso ? 'text-idoso-lg' : 'text-lg'}`}>
                {profissional.nome}
              </h3>
              <p className={`font-medium text-recife-secondary ${tamanhoTexto}`}>
                {profissional.especialidade} • <span className="text-gray-600">{profissional.crm}</span>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-start gap-3 text-gray-700">
            <Building2 className="text-gray-500 shrink-0 mt-0.5" size={modoIdoso ? 26 : 20} />
            <div>
              <p className={`font-semibold text-gray-900 ${tamanhoTexto}`}>{profissional.clinicaNome}</p>
              <p className={`text-gray-500 flex items-center gap-1 mt-0.5 ${tamanhoTexto}`}>
                <MapPin size={16} className="inline shrink-0" />
                {profissional.endereco}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Calendar className="text-recife-primary" size={modoIdoso ? 30 : 24} />
            <h2 className={tamanhoSubtitulo}>Selecione o Dia da Consulta</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {diasDisponiveis.map((dia) => {
              const selecionado = dataSelecionada === dia.iso
              return (
                <button
                  key={dia.iso}
                  type="button"
                  onClick={() => {
                    setDataSelecionada(dia.iso)
                    setErroConflito('')
                  }}
                  aria-pressed={selecionado}
                  className={`rounded-2xl border-2 p-3 sm:p-4 text-center transition-all flex flex-col items-center justify-center ${
                    selecionado
                      ? 'bg-recife-primary text-white border-recife-dark shadow-md ring-4 ring-recife-accent/30'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-recife-accent hover:bg-gray-50'
                  } ${modoIdoso ? 'min-h-[84px]' : 'min-h-[70px]'}`}
                >
                  <span className={`uppercase font-bold ${modoIdoso ? 'text-idoso-base' : 'text-xs text-gray-500'} ${selecionado ? 'text-white' : ''}`}>
                    {dia.diaSemana}
                  </span>
                  <span className={`font-black mt-1 ${modoIdoso ? 'text-idoso-lg' : 'text-lg'}`}>
                    {dia.dataFormatada}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="pt-2">
            <label htmlFor="data-personalizada" className={`block text-gray-600 font-medium mb-1 ${tamanhoTexto}`}>
              Ou escolha outra data no calendário:
            </label>
            <input
              id="data-personalizada"
              type="date"
              value={dataSelecionada}
              min={diasDisponiveis[0]?.iso}
              onChange={(e) => {
                setDataSelecionada(e.target.value)
                setErroConflito('')
              }}
              className={`w-full border-2 border-gray-300 rounded-xl px-4 font-medium text-gray-800 focus:outline-none focus:border-recife-primary ${
                modoIdoso ? 'h-16 text-idoso-base' : 'h-12 text-base'
              }`}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-gray-900">
            <Clock className="text-recife-primary" size={modoIdoso ? 30 : 24} />
            <h2 className={tamanhoSubtitulo}>Selecione o Horário Disponível</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {horariosPadrao.map((horario) => {
              const selecionado = horarioSelecionado === horario
              return (
                <button
                  key={horario}
                  type="button"
                  onClick={() => selecionarHorario(horario)}
                  aria-pressed={selecionado}
                  aria-label={`Horário ${horario}`}
                  className={`rounded-2xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                    selecionado
                      ? 'bg-recife-primary text-white border-recife-dark shadow-md ring-4 ring-recife-accent/40 scale-105'
                      : 'bg-white text-gray-800 border-gray-300 hover:border-recife-accent hover:bg-gray-50'
                  } ${
                    modoIdoso
                      ? 'min-h-[72px] p-4 text-idoso-lg'
                      : 'min-h-[54px] p-3 text-lg'
                  }`}
                >
                  <Clock size={modoIdoso ? 24 : 18} />
                  <span>{horario}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border-2 border-recife-accent/30 shadow-md p-5 sm:p-6 space-y-5">
          <h2 className={`text-recife-dark border-b border-gray-100 pb-3 ${tamanhoSubtitulo}`}>
            Resumo do Agendamento
          </h2>

          <div className={`space-y-3 ${tamanhoTexto}`}>
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-500 font-medium">Médico:</span>
              <span className="font-bold text-gray-900 text-right">{profissional.nome}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-500 font-medium">Especialidade:</span>
              <span className="font-bold text-recife-primary text-right">{profissional.especialidade}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-gray-500 font-medium">Local:</span>
              <span className="font-semibold text-gray-800 text-right">{profissional.clinicaNome}</span>
            </div>
            <div className="flex justify-between items-start gap-4 pt-2 border-t border-gray-100">
              <span className="text-gray-500 font-medium">Data e Horário:</span>
              <span className={`font-black text-right ${horarioSelecionado ? 'text-recife-dark' : 'text-gray-400'} ${tamanhoSubtitulo}`}>
                {dataFormatadaExibicao} {horarioSelecionado ? `às ${horarioSelecionado}` : '(Escolha o horário)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmarAgendamento}
            disabled={!dataSelecionada || !horarioSelecionado || carregando}
            className={`w-full bg-recife-primary text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 ${
              dataSelecionada && horarioSelecionado && !carregando
                ? 'hover:bg-recife-dark active:scale-[0.99] cursor-pointer'
                : 'opacity-50 cursor-not-allowed bg-gray-400'
            } ${
              modoIdoso
                ? 'min-h-[72px] text-idoso-lg py-5'
                : 'min-h-[56px] text-lg py-4'
            }`}
          >
            {carregando ? (
              <>
                <Loader2 size={modoIdoso ? 30 : 24} className="animate-spin" />
                <span>Confirmando agendamento...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={modoIdoso ? 28 : 22} />
                <span>Confirmar Agendamento</span>
              </>
            )}
          </button>
        </section>
      </main>
    </div>
  )
}

export default Agendamento
