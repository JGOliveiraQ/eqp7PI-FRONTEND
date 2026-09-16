import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck } from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'
import { unidadesDeSaude, especialidades, horariosDisponiveis } from '../data/mockData'

function Agendamento() {
  const { modoIdoso } = useAcessibilidade()

  const [unidadeSelecionada, setUnidadeSelecionada] = useState('')
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('')
  const [dataSelecionada, setDataSelecionada] = useState('')
  const [horarioSelecionado, setHorarioSelecionado] = useState('')

  const tamanhoTexto = modoIdoso ? 'text-idoso-base' : 'text-base'
  const tamanhoTitulo = modoIdoso ? 'text-idoso-xl' : 'text-xl'
  const alturaInput = modoIdoso ? 'h-14' : 'h-10'

  const formularioCompleto =
    unidadeSelecionada && especialidadeSelecionada && dataSelecionada && horarioSelecionado

  const enviarAgendamento = (evento) => {
    evento.preventDefault()
    alert('Agendamento realizado com sucesso!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-recife-primary text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <ArrowLeft size={modoIdoso ? 28 : 24} />
          </Link>
          <h1 className={`font-bold ${tamanhoTitulo}`}>Agendar Consulta</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={enviarAgendamento} className="space-y-6">
          <fieldset>
            <label className={`block font-medium text-gray-700 mb-1 ${tamanhoTexto}`}>
              Unidade de Saúde
            </label>
            <select
              value={unidadeSelecionada}
              onChange={(e) => setUnidadeSelecionada(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-3 ${alturaInput} ${tamanhoTexto}`}
            >
              <option value="">Selecione a unidade</option>
              {unidadesDeSaude.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.nome}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <label className={`block font-medium text-gray-700 mb-1 ${tamanhoTexto}`}>
              Especialidade
            </label>
            <select
              value={especialidadeSelecionada}
              onChange={(e) => setEspecialidadeSelecionada(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-3 ${alturaInput} ${tamanhoTexto}`}
            >
              <option value="">Selecione a especialidade</option>
              {especialidades.map((especialidade) => (
                <option key={especialidade.id} value={especialidade.id}>
                  {especialidade.nome}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <label className={`block font-medium text-gray-700 mb-1 ${tamanhoTexto}`}>
              Data
            </label>
            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className={`w-full border border-gray-300 rounded-lg px-3 ${alturaInput} ${tamanhoTexto}`}
            />
          </fieldset>

          <fieldset>
            <label className={`block font-medium text-gray-700 mb-1 ${tamanhoTexto}`}>
              Horário
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {horariosDisponiveis.map((horario) => (
                <button
                  key={horario}
                  type="button"
                  onClick={() => setHorarioSelecionado(horario)}
                  className={`rounded-lg border-2 py-2 font-medium transition-colors ${
                    horarioSelecionado === horario
                      ? 'border-recife-primary bg-recife-primary text-white'
                      : 'border-gray-300 hover:border-recife-accent'
                  } ${tamanhoTexto}`}
                >
                  {horario}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!formularioCompleto}
            className={`w-full bg-recife-primary text-white font-bold rounded-xl py-4 transition-opacity ${
              formularioCompleto ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
            } ${modoIdoso ? 'text-idoso-lg' : 'text-lg'}`}
          >
            <span className="flex items-center justify-center gap-2">
              <CalendarCheck size={modoIdoso ? 24 : 20} />
              Confirmar Agendamento
            </span>
          </button>
        </form>
      </main>
    </div>
  )
}

export default Agendamento
