import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Clock, Search } from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'
import { unidadesDeSaude } from '../data/mockData'

function Unidades() {
  const { modoIdoso } = useAcessibilidade()
  const [termoBusca, setTermoBusca] = useState('')

  const tamanhoTexto = modoIdoso ? 'text-idoso-base' : 'text-base'
  const tamanhoTitulo = modoIdoso ? 'text-idoso-xl' : 'text-xl'

  const unidadesFiltradas = unidadesDeSaude.filter((unidade) =>
    unidade.nome.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-recife-primary text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <ArrowLeft size={modoIdoso ? 28 : 24} />
          </Link>
          <h1 className={`font-bold ${tamanhoTitulo}`}>Unidades de Saúde</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar unidade..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className={`w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 ${tamanhoTexto}`}
          />
        </div>

        <div className="space-y-4">
          {unidadesFiltradas.map((unidade) => (
            <article
              key={unidade.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
            >
              <h2 className={`font-bold text-recife-dark mb-3 ${modoIdoso ? 'text-idoso-lg' : 'text-lg'}`}>
                {unidade.nome}
              </h2>

              <div className={`space-y-2 text-gray-600 ${tamanhoTexto}`}>
                <p className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-recife-primary" />
                  {unidade.endereco}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} className="shrink-0 text-recife-primary" />
                  {unidade.telefone}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={18} className="shrink-0 text-recife-primary" />
                  {unidade.horarioFuncionamento}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {unidade.servicosDisponiveis.map((servico) => (
                  <span
                    key={servico}
                    className={`bg-recife-light text-recife-dark rounded-full px-3 py-1 font-medium ${
                      modoIdoso ? 'text-sm' : 'text-xs'
                    }`}
                  >
                    {servico}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {unidadesFiltradas.length === 0 && (
            <p className={`text-center text-gray-500 py-10 ${tamanhoTexto}`}>
              Nenhuma unidade encontrada para "{termoBusca}"
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Unidades
