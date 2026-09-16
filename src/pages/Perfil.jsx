import { Link } from 'react-router-dom'
import { ArrowLeft, User, FileText, Bell } from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'

const dadosUsuario = {
  nome: 'Maria da Silva',
  cpf: '***.***.***-00',
  cartaoSUS: '7085 0000 0000 0000',
  dataNascimento: '15/03/1960',
}

const menuPerfil = [
  { titulo: 'Meus Agendamentos', icone: FileText },
  { titulo: 'Notificações', icone: Bell },
]

function Perfil() {
  const { modoIdoso } = useAcessibilidade()

  const tamanhoTexto = modoIdoso ? 'text-idoso-base' : 'text-base'
  const tamanhoTitulo = modoIdoso ? 'text-idoso-xl' : 'text-xl'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-recife-primary text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <ArrowLeft size={modoIdoso ? 28 : 24} />
          </Link>
          <h1 className={`font-bold ${tamanhoTitulo}`}>Meu Perfil</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-recife-light rounded-full p-4">
              <User size={modoIdoso ? 40 : 32} className="text-recife-primary" />
            </div>
            <div>
              <h2 className={`font-bold text-recife-dark ${modoIdoso ? 'text-idoso-lg' : 'text-lg'}`}>
                {dadosUsuario.nome}
              </h2>
              <p className={`text-gray-500 ${modoIdoso ? 'text-idoso-base' : 'text-sm'}`}>
                Cartão SUS: {dadosUsuario.cartaoSUS}
              </p>
            </div>
          </div>

          <div className={`space-y-3 ${tamanhoTexto}`}>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">CPF</span>
              <span className="font-medium">{dadosUsuario.cpf}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Data de Nascimento</span>
              <span className="font-medium">{dadosUsuario.dataNascimento}</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {menuPerfil.map((item) => {
            const Icone = item.icone
            return (
              <button
                key={item.titulo}
                className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${tamanhoTexto}`}
              >
                <Icone size={modoIdoso ? 28 : 22} className="text-recife-primary" />
                <span className="font-medium">{item.titulo}</span>
              </button>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default Perfil
