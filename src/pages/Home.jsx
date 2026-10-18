import { Link } from 'react-router-dom';
import { Bell, CalendarDays, ChevronRight, MapPin, Star, UserRound } from 'lucide-react';

const proximasConsultas = [
  {
    nome: 'Dr. Carlos',
    especialidade: 'Ortopedia',
    data: '12:00, 24 de Setembro, 2026',
    status: 'Confirmado',
    statusClass: 'text-[#1e7f5d] bg-[#edf9f3]',
  },
  {
    nome: 'Dra. Amanda',
    especialidade: 'Cardiologia',
    data: '09:20, 30 de Setembro, 2026',
    status: 'Online',
    statusClass: 'text-[#4b5563] bg-[#f3f4f6]',
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
  return (
    <div className="min-h-screen bg-[#edf3ef] px-3 py-4 sm:px-5">
      <main className="mx-auto max-w-[430px] rounded-[32px] bg-[#f5f7f5] shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-[#dfe8e3]">
        <header className="rounded-t-[32px] bg-[#0f8b5f] px-4 pb-6 pt-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-emerald-50">Olá, Maria! 👋</p>
            </div>
            <button
              type="button"
              aria-label="Notificações"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1ca46f] text-white shadow-inner"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-2 text-[17px] font-semibold text-white/90">Como podemos cuidar de você hoje?</div>

          <div className="mt-4 rounded-[24px] border border-white/20 bg-[#eaf8f1] px-4 py-3 text-[#18372d] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f8b5f] text-white shadow-sm">
                <UserRound className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold text-[#1e463c]">Assistente de IA</div>
                <div className="mt-0.5 text-[12px] text-[#49615c]">Descreva seus sintomas e receba orientação</div>
              </div>
              <ChevronRight className="h-5 w-5 text-[#1e463c]" />
            </div>
          </div>
        </header>

        <div className="space-y-5 px-4 pb-5 pt-4">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#16352d]">Próximas consultas</h2>
              <button type="button" className="text-[13px] font-medium text-[#1b8a5c]">Ver todas</button>
            </div>

            <div className="space-y-3">
              {proximasConsultas.map((consulta) => (
                <div key={consulta.nome} className="rounded-[20px] border border-[#e2e8e4] bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dff3e8] text-[12px] font-bold text-[#0f8b5f]">
                        {consulta.nome.split(' ').map((piece) => piece[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div className="text-[15px] font-bold text-[#15362d]">{consulta.nome}</div>
                        <div className="mt-1 text-[12px] text-[#5d706b]">{consulta.especialidade}</div>
                        <div className="mt-1 text-[12px] text-[#5d706b]">{consulta.data}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${consulta.statusClass}`}>
                      {consulta.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Link
            to="/agendamento"
            className="block rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-center text-[16px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)]"
          >
            Meus agendamentos
          </Link>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#16352d]">Médicos em destaque</h2>
              <button type="button" className="text-[13px] font-medium text-[#1b8a5c]">Ver mais</button>
            </div>

            <div className="space-y-3">
              {medicos.map((medico) => (
                <div key={medico.nome} className="flex items-center justify-between gap-3 rounded-[20px] border border-[#e2e8e4] bg-white px-3 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dff3e8] text-[12px] font-bold text-[#0f8b5f]">
                      {medico.avatar}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-[#15362d]">{medico.nome}</div>
                      <div className="mt-1 text-[12px] text-[#5d706b]">{medico.especialidade}</div>
                      <div className="mt-1 flex items-center gap-2 text-[12px] text-[#5d706b]">
                        <MapPin className="h-3.5 w-3.5 text-[#0f8b5f]" />
                        {medico.local}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[12px] text-[#5d706b]">
                        <CalendarDays className="h-3.5 w-3.5 text-[#0f8b5f]" />
                        {medico.horario}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-[#edf9f3] px-2 py-1 text-[12px] font-bold text-[#1e7f5d]">
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
