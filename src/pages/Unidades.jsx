import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Clock, Search, Navigation } from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'
import { unidadesDeSaude } from '../data/mockData'
import SairButton from '../components/SairButton'

function Unidades() {
  const { modoIdoso } = useAcessibilidade()
  const [termoBusca, setTermoBusca] = useState('')

  const tamanhoTexto = modoIdoso ? 'text-idoso-base' : 'text-base'
  const tamanhoTitulo = modoIdoso ? 'text-idoso-xl' : 'text-2xl'

  const unidadesFiltradas = unidadesDeSaude.filter((unidade) =>
    unidade.nome.toLowerCase().includes(termoBusca.toLowerCase())
  )

  return (
    <div className="app-shell">
      <header className="bg-[#0f8b5f] text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="rounded-full border border-white/15 bg-white/10 p-2 transition hover:bg-white/15">
            <ArrowLeft size={modoIdoso ? 28 : 20} />
          </Link>
          <h1 className={`flex-1 font-bold ${tamanhoTitulo}`}>Unidades de saúde</h1>
          <SairButton />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="soft-card mb-6 p-4 sm:p-5">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5b7068]" />
            <input
              type="text"
              placeholder="Buscar unidade ou bairro"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full rounded-2xl border border-[#dfeae6] bg-[#f6faf7] py-3 pl-11 pr-4 text-base text-[#18322d] outline-none transition focus:border-[#0f8b5f] focus:ring-2 focus:ring-[#0f8b5f]/20"
            />
          </div>
        </section>

        <div className="space-y-4">
          {unidadesFiltradas.map((unidade) => (
            <article
              key={unidade.id}
              className="soft-card p-4 sm:p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f8b5f]">Atendimento</p>
                  <h2 className={`font-bold text-[#18322d] ${modoIdoso ? 'text-idoso-lg' : 'text-xl'}`}>
                    {unidade.nome}
                  </h2>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#eaf8f1] px-3 py-2 text-sm font-semibold text-[#0f8b5f] transition hover:bg-[#def5e8]">
                  <Navigation size={16} />
                  Ver rota
                </button>
              </div>

              <div className={`space-y-3 text-[#475d5a] ${tamanhoTexto}`}>
                <p className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-[#0f8b5f]" />
                  <span>{unidade.endereco}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} className="shrink-0 text-[#0f8b5f]" />
                  <span>{unidade.telefone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={18} className="shrink-0 text-[#0f8b5f]" />
                  <span>{unidade.horarioFuncionamento}</span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {unidade.servicosDisponiveis.map((servico) => (
                  <span
                    key={servico}
                    className="rounded-full bg-[#edf7f2] px-3 py-1.5 text-xs font-semibold text-[#1b4339]"
                  >
                    {servico}
                  </span>
                ))}
              </div>
            </article>
          ))}

          {unidadesFiltradas.length === 0 && (
            <p className={`rounded-2xl border border-dashed border-[#dfeae6] bg-white py-10 text-center text-[#5a6e69] ${tamanhoTexto}`}>
              Nenhuma unidade encontrada para “{termoBusca}”.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Unidades
