import { Link } from 'react-router-dom';
import { Bell, CalendarDays, ChevronRight, MapPin, Star, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const proximasConsultas = [
  {
    nome: 'Dr. Carlos',
    especialidade: 'Ortopedia',
    data: '12:00, 24 de Setembro, 2026',
    status: 'Confirmado',
    statusClass: 'bg-[#edf9f3] text-[#1e7f5d]',
    avatar: 'C',
  },
  {
    nome: 'Dra. Amanda',
    especialidade: 'Cardiologia',
    data: '09:20, 30 de Setembro, 2026',
    status: 'Online',
    statusClass: 'bg-[#f3f4f6] text-[#4b5563]',
    avatar: 'A',
  },
];

const medicos = [
  {
    nome: 'Dr. Carlos Mendonça',
    especialidade: 'Ortopedia',
    local: 'Clínica',
    horario: 'Amanhã, 09h00',
    avaliacao: '4.9',
    avatar: 'CM',
  },
  {
    nome: 'Dra. Amanda Ferreira',
    especialidade: 'Cardiologia',
    local: 'Hospital das',
    horario: 'Hoje, 16h30',
    avaliacao: '4.8',
    avatar: 'AF',
  },
];

function Home() {
  const { usuario } = useAuth();
  const nomePrimeiro = usuario?.nome?.trim()?.split(/\s+/)[0] || 'Maria';

  return (
    <div className="min-h-screen bg-[#f3f7f5] px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
      <main className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[30px] bg-[#f7faf8] shadow-[0_4px_12px_rgba(18,44,32,0.04)] lg:rounded-[34px]">
        <header className="bg-[#0f8b5f] px-4 pb-6 pt-4 text-white sm:px-5 lg:px-6">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-white sm:text-[15px]">Olá, {nomePrimeiro}! 👋</p>
            <button
              type="button"
              aria-label="Notificações"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1ca46f] text-white shadow-inner"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 text-[17px] font-semibold text-white/90 sm:text-[18px]">Como podemos cuidar de você hoje?</div>

          <Link
            to="/assistente-ia"
            className="mt-4 flex items-center gap-3 rounded-[22px] border border-white/20 bg-[#ebfaf2] px-3 py-3 text-[#16372f] shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f8b5f] text-white shrink-0">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-[#1e463c]">Assistente de IA</div>
              <div className="mt-0.5 text-[12px] text-[#49615c]">Descreva seus sintomas e receba orientação</div>
            </div>
            <ChevronRight className="h-5 w-5 text-[#1e463c] shrink-0" />
          </Link>
        </header>

        <div className="space-y-5 px-4 pb-5 pt-4 sm:px-5">
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-bold text-[#16352d] sm:text-[18px]">Próximas consultas</h2>
              <button type="button" className="text-[13px] font-medium text-[#1b8a5c]">Ver todas</button>
            </div>

            <div className="space-y-3">
              {proximasConsultas.map((consulta) => (
                <div key={consulta.nome} className="rounded-[18px] bg-[#f7faf8] px-3 py-3 shadow-[0_4px_12px_rgba(18,44,32,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[12px] font-bold text-[#0f8b5f]">
                        {consulta.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[15px] font-bold text-[#15362d]">{consulta.nome}</div>
                        <div className="mt-1 text-[12px] text-[#5d706b]">{consulta.especialidade}</div>
                        <div className="mt-1 text-[12px] text-[#5d706b]">{consulta.data}</div>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${consulta.statusClass}`}>
                      {consulta.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Link
            to="/meus-agendamentos"
            className="block rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-center text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)] transition-opacity hover:opacity-95"
          >
            Meus agendamentos
          </Link>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[17px] font-bold text-[#16352d] sm:text-[18px]">Médicos em destaque</h2>
              <button type="button" className="text-[13px] font-medium text-[#1b8a5c]">Ver mais</button>
            </div>

            <div className="space-y-3">
              {medicos.map((medico) => (
                <div key={medico.nome} className="flex items-center justify-between gap-3 rounded-[18px] bg-[#f7faf8] px-3 py-3 shadow-[0_4px_12px_rgba(18,44,32,0.04)]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dff3e8] text-[12px] font-bold text-[#0f8b5f]">
                      {medico.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-bold text-[#15362d]">{medico.nome}</div>
                      <div className="mt-1 text-[12px] text-[#5d706b]">{medico.especialidade}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#5d706b]">
                        <MapPin className="h-3.5 w-3.5 text-[#0f8b5f]" />
                        <span className="truncate">{medico.local}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[12px] text-[#5d706b]">
                        <CalendarDays className="h-3.5 w-3.5 text-[#0f8b5f]" />
                        <span className="truncate">{medico.horario}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-[#edf9f3] px-2 py-1 text-[12px] font-bold text-[#1d7c57]">
                      <Star className="h-3.5 w-3.5 fill-[#0f8b5f] text-[#0f8b5f]" />
                      {medico.avaliacao}
                    </div>
                    <button type="button" className="rounded-full border border-[#dfeae6] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#1b8a5c]">
                      Ver perfil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Home;
