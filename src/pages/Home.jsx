import { Link } from 'react-router-dom'
import { Calendar, MapPin, User, Accessibility } from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'

const acoesRapidas = [
  {
    titulo: 'Agendar Consulta',
    descricao: 'Marque sua consulta na unidade mais próxima',
    icone: Calendar,
    rota: '/agendamento',
    cor: 'bg-recife-primary',
  },
  {
    titulo: 'Unidades de Saúde',
    descricao: 'Encontre a UBS mais perto de você',
    icone: MapPin,
    rota: '/unidades',
    cor: 'bg-recife-secondary',
  },
  {
    titulo: 'Meu Perfil',
    descricao: 'Acesse seus dados e histórico',
    icone: User,
    rota: '/perfil',
    cor: 'bg-recife-accent',
  },
]

function Home() {
  const { modoIdoso, alternarModoIdoso } = useAcessibilidade()

  const tamanhoCabecalho = modoIdoso ? 'text-idoso-2xl' : 'text-3xl'
  const tamanhoTexto = modoIdoso ? 'text-idoso-lg' : 'text-base'
  const tamanhoBotao = modoIdoso ? 'p-6' : 'p-4'

  return (
    <div className="min-h-screen bg-recife-light">
      <header className="bg-recife-primary text-white px-4 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className={`font-bold ${tamanhoCabecalho}`}>Saúde Recife</h1>
          <button
            onClick={alternarModoIdoso}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 transition-colors"
            aria-label="Alternar modo de acessibilidade"
          >
            <Accessibility size={modoIdoso ? 28 : 20} />
            <span className={modoIdoso ? 'text-idoso-base' : 'text-sm'}>
              {modoIdoso ? 'Modo Padrão' : 'Modo Idoso'}
            </span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className={`font-semibold text-recife-dark mb-2 ${modoIdoso ? 'text-idoso-xl' : 'text-xl'}`}>
            Bem-vindo(a)!
          </h2>
          <p className={`text-gray-600 ${tamanhoTexto}`}>
            Acesse os serviços de saúde pública do Recife de forma rápida e prática.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {acoesRapidas.map((acao) => {
            const Icone = acao.icone
            return (
              <Link
                key={acao.rota}
                to={acao.rota}
                className={`${acao.cor} text-white rounded-xl ${tamanhoBotao} hover:opacity-90 transition-opacity shadow-md`}
              >
                <Icone size={modoIdoso ? 40 : 32} className="mb-3" />
                <h3 className={`font-bold mb-1 ${modoIdoso ? 'text-idoso-lg' : 'text-lg'}`}>
                  {acao.titulo}
                </h3>
                <p className={`opacity-90 ${modoIdoso ? 'text-idoso-base' : 'text-sm'}`}>
                  {acao.descricao}
                </p>
              </Link>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default Home
