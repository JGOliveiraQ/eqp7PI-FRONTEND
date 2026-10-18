import { Link } from 'react-router-dom'
import { ArrowLeft, User, FileText, Bell, ShieldCheck, CalendarCheck2 } from 'lucide-react'
import { useAcessibilidade } from '../context/AcessibilidadeContext'
import SairButton from '../components/SairButton'

const dadosUsuario = {
  nome: 'Maria da Silva',
  cpf: '***.***.***-00',
  cartaoSUS: '7085 0000 0000 0000',
  dataNascimento: '15/03/1960',
}

const menuPerfil = [
  { titulo: 'Meus agendamentos', icone: CalendarCheck2 },
  { titulo: 'Notificações', icone: Bell },
]

function Perfil() {
  const { modoIdoso } = useAcessibilidade()

  const tamanhoTexto = modoIdoso ? 'text-idoso-base' : 'text-base'
  const tamanhoTitulo = modoIdoso ? 'text-idoso-xl' : 'text-2xl'

  return (
    <div className="app-shell">
      <header className="bg-[#0f8b5f] text-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="rounded-full border border-white/15 bg-white/10 p-2 transition hover:bg-white/15">
            <ArrowLeft size={modoIdoso ? 28 : 20} />
          </Link>
          <h1 className={`flex-1 font-bold ${tamanhoTitulo}`}>Meu perfil</h1>
          <SairButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="soft-card mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-[#ebfaf2] to-white p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dff4e9] text-[#0f8b5f]">
                <User size={28} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0f8b5f]">Paciente</p>
                <h2 className={`mt-1 font-bold text-[#123129] ${modoIdoso ? 'text-idoso-lg' : 'text-2xl'}`}>
                  {dadosUsuario.nome}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-[#dfeae6] bg-white px-3 py-2 text-sm text-[#29453d] shadow-sm">
              <ShieldCheck size={16} className="text-[#0f8b5f]" />
              Cartão SUS: {dadosUsuario.cartaoSUS}
            </div>
          </div>

          <div className={`space-y-4 p-5 sm:p-6 ${tamanhoTexto}`}>
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <span className="text-[#617774]">CPF</span>
              <span className="font-semibold text-[#153329]">{dadosUsuario.cpf}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#edf2f0] pb-3">
              <span className="text-[#617774]">Data de nascimento</span>
              <span className="font-semibold text-[#153329]">{dadosUsuario.dataNascimento}</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <span className="text-[#617774]">Status da conta</span>
              <span className="rounded-full bg-[#eaf8f1] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#0f8b5f]">
                Ativa
              </span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {menuPerfil.map((item) => {
            const Icone = item.icone
            return (
              <button
                key={item.titulo}
                className="soft-card flex w-full items-center justify-between gap-4 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(17,44,36,0.07)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f2] text-[#0f8b5f]">
                    <Icone size={20} />
                  </div>
                  <span className={`font-semibold text-[#17342d] ${tamanhoTexto}`}>{item.titulo}</span>
                </div>
                <ArrowLeft className="rotate-180 text-[#0f8b5f]" size={18} />
              </button>
            )
          })}
        </section>
      </main>
    </div>
  )
}

export default Perfil
