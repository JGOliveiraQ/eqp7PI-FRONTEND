import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  HeartPulse,
  MapPin,
  MessageSquareText,
  PencilLine,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  UserRound,
  XCircle,
} from 'lucide-react';

const shellClass = 'min-h-screen bg-[#edf3ef] px-3 py-4 sm:px-5 lg:px-8';
const cardClass = 'mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] bg-[#f5f7f5] shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-[#dfe8e3]';

function PageFrame({ title, subtitle, backTo = '/', action, children }) {
  return (
    <div className={shellClass}>
      <main className={cardClass}>
        <header className="rounded-t-[32px] bg-[#0f8b5f] px-4 pb-6 pt-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <Link
              to={backTo}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 text-center">
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-emerald-100/85">Saúde Recife</p>
              <h1 className="mt-1 text-[1.05rem] font-bold leading-5">{title}</h1>
            </div>
            <button type="button" aria-label="Notificações" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
              <Bell className="h-4 w-4" />
            </button>
          </div>
          {subtitle ? <p className="mt-3 text-[13px] text-emerald-50/90">{subtitle}</p> : null}
          {action ? <div className="mt-4">{action}</div> : null}
        </header>
        <div className="space-y-4 px-4 pb-5 pt-4">{children}</div>
      </main>
    </div>
  );
}

export function BuscarAtendimento() {
  return (
    <PageFrame
      title="Buscar atendimento"
      subtitle="Encontre o cuidado ideal para você"
      backTo="/"
      action={
        <div className="flex items-center gap-2 rounded-[18px] bg-[#eaf8f1] px-3 py-2 text-[#16372f] shadow-sm">
          <Search className="h-4 w-4 text-[#0f8b5f]" />
          <input
            aria-label="Buscar atendimento"
            value="Dores de cabeça"
            readOnly
            className="w-full bg-transparent text-[13px] font-medium text-[#16372f] placeholder:text-[#5a726d] focus:outline-none"
          />
        </div>
      }
    >
      <section className="rounded-[20px] border border-[#e2e8e4] bg-white p-3 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#15362d]">Sugestões</h2>
          <button type="button" className="text-[12px] font-semibold text-[#1b8a5c]">Filtrar</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {['Clínica Geral', 'Pediatria', 'Cardiologia', 'Dermatologia'].map((item) => (
            <button key={item} type="button" className="rounded-[16px] border border-[#dfeae6] bg-[#f5faf7] px-3 py-3 text-left text-[13px] font-semibold text-[#20473d]">
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-bold text-[#15362d]">Unidades próximas</h2>
        {[
          { nome: 'UBS Engenho do Meio', rua: 'Rua José Maria, 120', tempo: '8 min' },
          { nome: 'Policlínica Lessa de Andrade', rua: 'Rua Cônego Barata, 668', tempo: '12 min' },
        ].map((item) => (
          <div key={item.nome} className="rounded-[20px] border border-[#e2e8e4] bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-bold text-[#15362d]">{item.nome}</div>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-[#5d706b]">
                  <MapPin className="h-3.5 w-3.5 text-[#0f8b5f]" />
                  {item.rua}
                </div>
              </div>
              <span className="rounded-full bg-[#edf9f3] px-2 py-1 text-[11px] font-semibold text-[#1d7c57]">{item.tempo}</span>
            </div>
            <Link to="/especialidades" className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold text-[#0f8b5f]">
              Ver especialidades <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </section>
    </PageFrame>
  );
}

export function Especialidades() {
  const especialidades = ['Clínica Geral', 'Pediatria', 'Cardiologia', 'Dermatologia', 'Ginecologia', 'Odontologia'];

  return (
    <PageFrame title="Especialidades" subtitle="Escolha a área clínica" backTo="/buscar-atendimento">
      <div className="grid grid-cols-2 gap-3">
        {especialidades.map((item, index) => (
          <Link
            key={item}
            to="/profissionais"
            className={`rounded-[20px] border p-4 text-left shadow-sm ${index % 2 === 0 ? 'border-[#dff3e8] bg-[#ecf9f1]' : 'border-[#e2e8e4] bg-white'}`}
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#0f8b5f] text-white">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="text-[15px] font-bold text-[#15362d]">{item}</div>
            <div className="mt-2 text-[12px] text-[#5d706b]">{index + 3} profissionais disponíveis</div>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}

export function Profissionais() {
  const profissionais = [
    { nome: 'Dra. Ana Beatriz Silva', especialidade: 'Clínica Geral', avaliacao: '4.9', tempo: 'Próximo disponível', icon: 'AB' },
    { nome: 'Dr. Carlos Eduardo Ramos', especialidade: 'Cardiologia', avaliacao: '4.8', tempo: 'Hoje, 17h30', icon: 'CR' },
    { nome: 'Dra. Mariana Vasconcelos', especialidade: 'Ginecologia', avaliacao: '4.7', tempo: 'Amanhã, 08h00', icon: 'MV' },
  ];

  return (
    <PageFrame title="Profissionais" subtitle="Profissionais disponíveis" backTo="/especialidades">
      <div className="space-y-3">
        {profissionais.map((profissional) => (
          <Link to="/perfil-medico" key={profissional.nome} className="block rounded-[20px] border border-[#e2e8e4] bg-white p-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dff3e8] text-[12px] font-bold text-[#0f8b5f]">
                {profissional.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[15px] font-bold text-[#15362d]">{profissional.nome}</div>
                    <div className="mt-1 text-[12px] text-[#5d706b]">{profissional.especialidade}</div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-[#edf9f3] px-2 py-1 text-[11px] font-bold text-[#1d7c57]">
                    <Star className="h-3.5 w-3.5 fill-[#0f8b5f] text-[#0f8b5f]" />
                    {profissional.avaliacao}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-[#5d706b]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#0f8b5f]" />
                  {profissional.tempo}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}

export function PerfilMedico() {
  return (
    <PageFrame title="Perfil do médico" backTo="/profissionais">
      <div className="rounded-[24px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dff3e8] text-[15px] font-bold text-[#0f8b5f]">AB</div>
          <div>
            <div className="text-[18px] font-bold text-[#15362d]">Dra. Ana Beatriz Silva</div>
            <div className="text-[13px] text-[#5d706b]">Clínica Geral • CRM-PE 14258</div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[18px] bg-[#edf9f3] px-3 py-2 text-[12px] text-[#1e7f5d]">
          <span className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" /> Atende por telemedicina</span>
          <span className="font-semibold">4.9 ★</span>
        </div>

        <div className="mt-4 space-y-3 text-[13px] text-[#435b55]">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-[#0f8b5f]" />
            <span>UBS Engenho do Meio • Rua José Maria, 120, Engenho do Meio</span>
          </div>
          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 text-[#0f8b5f]" />
            <span>Disponibilidade: seg a sex, 08h às 17h</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 text-[#0f8b5f]" />
            <span>Contato: (81) 3355-7801</span>
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <h2 className="text-[15px] font-bold text-[#15362d]">Sobre</h2>
        <p className="mt-2 text-[13px] leading-6 text-[#4d615d]">
          Especialista em acompanhamento clínico geral, orientações preventivas e avaliação de sintomas comuns com foco em acolhimento e prevenção.
        </p>
      </div>

      <Link to="/agendar-consulta" className="block rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-center text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)]">
        Agendar consulta
      </Link>
    </PageFrame>
  );
}

export function AgendarConsulta() {
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const horarios = ['08:00', '09:30', '10:30', '13:00', '14:00', '15:30'];

  return (
    <PageFrame title="Agendar consulta" subtitle="Escolha data e horário" backTo="/perfil-medico">
      <div className="rounded-[24px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <div className="text-[14px] font-bold text-[#15362d]">Dra. Ana Beatriz Silva</div>
        <div className="mt-1 text-[12px] text-[#5d706b]">Clínica Geral • UBS Engenho do Meio</div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {dias.map((dia, index) => (
            <button key={dia} type="button" className={`${index === 1 ? 'bg-[#0f8b5f] text-white' : 'bg-[#f3f8f5] text-[#20473d]'} rounded-[14px] border border-[#dfeae6] px-2 py-3 text-center text-[12px] font-semibold`}>
              <div>{dia}</div>
              <div className="mt-1 text-[10px] opacity-80">{12 + index} set</div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-2 text-[13px] font-bold text-[#15362d]">Horários disponíveis</div>
          <div className="grid grid-cols-3 gap-2">
            {horarios.map((hora, index) => (
              <button key={hora} type="button" className={`${index === 0 ? 'bg-[#eaf8f1] text-[#0d7d58] ring-1 ring-[#a8dcc5]' : 'bg-white text-[#20473d]'} rounded-[14px] border border-[#dfeae6] px-2 py-2 text-[12px] font-semibold`}>
                {hora}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[20px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-[14px] font-bold text-[#15362d]">
          <CalendarClock className="h-4 w-4 text-[#0f8b5f]" />
          Resumo da consulta
        </div>
        <div className="mt-3 space-y-2 text-[13px] text-[#4d615d]">
          <div className="flex items-center justify-between"><span>Data</span><span className="font-semibold text-[#15362d]">Terça, 13 de set</span></div>
          <div className="flex items-center justify-between"><span>Hora</span><span className="font-semibold text-[#15362d]">08:00</span></div>
          <div className="flex items-center justify-between"><span>Local</span><span className="font-semibold text-[#15362d]">UBS</span></div>
        </div>
      </div>

      <Link to="/consulta-sucesso" className="block rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-center text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)]">
        Confirmar consulta
      </Link>
    </PageFrame>
  );
}

export function ConsultaSucesso() {
  return (
    <PageFrame title="Consulta agendada" backTo="/" subtitle="Tudo certo com o seu atendimento">
      <div className="rounded-[28px] border border-[#dfeae6] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#dff3e8] text-[2.6rem] text-[#0f8b5f]">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h2 className="text-[1.8rem] font-extrabold tracking-[-0.05em] text-[#15362d]">Tudo certo!</h2>
        <p className="mt-2 text-[14px] leading-6 text-[#4d615d]">
          Sua consulta com Dra. Ana Beatriz Silva foi confirmada para terça, 13 de setembro, às 08:00.
        </p>
        <Link to="/" className="mt-6 block rounded-[16px] bg-[#0f8b5f] px-4 py-3 text-[15px] font-bold text-white">
          Voltar para o início
        </Link>
      </div>
    </PageFrame>
  );
}

export function AssistenteIA() {
  const messages = [
    { from: 'bot', text: 'Descreva seu sintoma principal e eu te ajudo com orientações iniciais.' },
    { from: 'user', text: 'Estou com dor de cabeça forte há 2 dias e febre.' },
  ];

  return (
    <PageFrame title="Assistente IA" subtitle="Orientação inicial" backTo="/">
      <div className="rounded-[24px] border border-[#e2e8e4] bg-[#f6fbf7] p-3 shadow-sm">
        <div className="mb-3 flex items-center gap-2 rounded-[18px] bg-white px-3 py-2 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f8b5f] text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#15362d]">Triagem inteligente</div>
            <div className="text-[11px] text-[#5d706b]">Leve em conta sua situação atual</div>
          </div>
        </div>

        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.text} className={`max-w-[82%] rounded-[18px] px-3 py-2 text-[12px] leading-5 ${message.from === 'bot' ? 'bg-white text-[#1f3c35]' : 'ml-auto bg-[#0f8b5f] text-white'}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#20473d]">
          {['Dor forte', 'Febre', 'Pressão', 'Tontura'].map((item) => (
            <button key={item} type="button" className="rounded-full border border-[#dfeae6] bg-white px-2 py-2">{item}</button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-[#dfeae6] bg-white px-3 py-2">
          <MessageSquareText className="h-4 w-4 text-[#0f8b5f]" />
          <input aria-label="Mensagem do assistente" value="Descreva seus sintomas" readOnly className="w-full bg-transparent text-[12px] text-[#4d615d] focus:outline-none" />
        </div>

        <Link to="/resultado-analise" className="mt-4 block rounded-[16px] bg-[#0f8b5f] px-4 py-3 text-center text-[14px] font-bold text-white">
          Obter análise
        </Link>
      </div>
    </PageFrame>
  );
}

export function ResultadoAnalise() {
  return (
    <PageFrame title="Resultado da análise" subtitle="Orientação inicial" backTo="/assistente-ia">
      <div className="rounded-[24px] border border-[#dfeae6] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-bold text-[#15362d]">Atenção</div>
          <span className="rounded-full bg-[#edf9f3] px-2.5 py-1 text-[11px] font-bold text-[#1e7f5d]">Baixo risco</span>
        </div>

        <div className="mt-4 rounded-[18px] bg-[#f3faf6] p-3 text-[13px] leading-6 text-[#4d615d]">
          Com base na sua descrição, a situação parece compatível com sintomas leves. A recomendação é manter hidratação, repouso e observar por 24 horas. Se piorar, procure atendimento.
        </div>

        <div className="mt-4 space-y-2 text-[13px] text-[#4d615d]">
          {['Hidratação adequada', 'Repouso e observação', 'Evitar esforço físico intenso'].map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-[12px] bg-[#f5faf7] px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-[#0f8b5f]" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <Link to="/agendamento" className="block rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-center text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)]">
        Agendar atendimento
      </Link>
    </PageFrame>
  );
}

export function MeusAgendamentos() {
  const consultas = [
    { nome: 'Dra. Ana Beatriz Silva', data: '12 de setembro • 08:00', status: 'Confirmado', tone: 'bg-[#edf9f3] text-[#1d7c57]' },
    { nome: 'Dr. Carlos Eduardo Ramos', data: '15 de setembro • 15:30', status: 'Em análise', tone: 'bg-[#f3f4f6] text-[#4b5563]' },
  ];

  return (
    <PageFrame title="Meus agendamentos" backTo="/" subtitle="Consultas e exames">
      <div className="space-y-3">
        {consultas.map((consulta) => (
          <Link to="/detalhes-consulta" key={consulta.nome} className="block rounded-[20px] border border-[#e2e8e4] bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[15px] font-bold text-[#15362d]">{consulta.nome}</div>
                <div className="mt-1 text-[12px] text-[#5d706b]">{consulta.data}</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${consulta.tone}`}>{consulta.status}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[12px] text-[#1b8a5c]">
              <span>Detalhes</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}

export function DetalhesConsulta() {
  return (
    <PageFrame title="Detalhes da consulta" backTo="/meus-agendamentos">
      <div className="rounded-[24px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[15px] font-bold text-[#15362d]">Dra. Ana Beatriz Silva</div>
            <div className="mt-1 text-[12px] text-[#5d706b]">Clínica Geral • UBS Engenho do Meio</div>
          </div>
          <span className="rounded-full bg-[#edf9f3] px-2 py-1 text-[11px] font-semibold text-[#1d7c57]">Confirmado</span>
        </div>

        <div className="mt-4 space-y-3 text-[13px] text-[#4d615d]">
          <div className="flex items-center justify-between"><span>Data</span><span className="font-semibold text-[#15362d]">12/09</span></div>
          <div className="flex items-center justify-between"><span>Horário</span><span className="font-semibold text-[#15362d]">08:00</span></div>
          <div className="flex items-center justify-between"><span>Local</span><span className="font-semibold text-[#15362d]">UBS</span></div>
          <div className="flex items-center justify-between"><span>Modalidade</span><span className="font-semibold text-[#15362d]">Presencial</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/reagendar-consulta" className="rounded-[16px] bg-[#eaf8f1] px-4 py-3 text-center text-[14px] font-bold text-[#155642]">
          Reagendar
        </Link>
        <Link to="/consulta-cancelada" className="rounded-[16px] bg-[#fff1f1] px-4 py-3 text-center text-[14px] font-bold text-[#b42318]">
          Cancelar
        </Link>
      </div>
    </PageFrame>
  );
}

export function ReagendarConsulta() {
  return (
    <PageFrame title="Reagendar consulta" subtitle="Escolha uma nova data" backTo="/detalhes-consulta">
      <div className="rounded-[24px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-2">
          {['Qua', 'Qui', 'Sex', 'Sáb', 'Seg', 'Ter'].map((dia, index) => (
            <button key={dia} type="button" className={`${index === 0 ? 'bg-[#0f8b5f] text-white' : 'bg-[#f3f8f5] text-[#20473d]'} rounded-[14px] border border-[#dfeae6] px-2 py-3 text-center text-[12px] font-semibold`}>
              {dia}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {['08:00', '09:00', '10:30', '13:00', '14:30', '15:30'].map((hora) => (
            <button key={hora} type="button" className="rounded-[14px] border border-[#dfeae6] bg-white px-2 py-2 text-[12px] font-semibold text-[#20473d]">
              {hora}
            </button>
          ))}
        </div>
      </div>

      <Link to="/detalhes-consulta" className="block rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-center text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)]">
        Confirmar reagendamento
      </Link>
    </PageFrame>
  );
}

export function ConsultaCancelada() {
  return (
    <PageFrame title="Consulta cancelada" subtitle="Sua solicitação foi enviada" backTo="/detalhes-consulta">
      <div className="rounded-[28px] border border-[#dfeae6] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1f1] text-[#d92d20]">
          <XCircle className="h-12 w-12" />
        </div>
        <h2 className="text-[1.7rem] font-extrabold tracking-[-0.05em] text-[#15362d]">Cancelada</h2>
        <p className="mt-2 text-[14px] leading-6 text-[#4d615d]">A consulta foi cancelada com sucesso e seu agendamento foi removido da agenda.</p>
        <Link to="/meus-agendamentos" className="mt-6 block rounded-[16px] bg-[#0f8b5f] px-4 py-3 text-[15px] font-bold text-white">
          Voltar para agendamentos
        </Link>
      </div>
    </PageFrame>
  );
}

export function EditarPerfil() {
  const { usuario } = useAuth();
  const nomeUsuario = usuario?.nome?.trim() || 'Maria Souza';
  const emailUsuario = usuario?.email || 'maria@email.com';
  const telefoneUsuario = usuario?.telefone || '(81) 99999-1234';
  const iniciais = nomeUsuario
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('') || 'MS';

  return (
    <PageFrame title="Editar perfil" subtitle="Atualize seus dados" backTo="/perfil">
      <div className="rounded-[24px] border border-[#e2e8e4] bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#dff3e8] text-[15px] font-bold text-[#0f8b5f]">{iniciais}</div>
          <div>
            <div className="text-[15px] font-bold text-[#15362d]">{nomeUsuario}</div>
            <div className="text-[12px] text-[#5d706b]">Paciente</div>
          </div>
        </div>

        <div className="space-y-3 text-[13px] text-[#4d615d]">
          <div className="rounded-[14px] border border-[#dfeae6] bg-[#f5faf7] p-3">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5d706b]">Nome</label>
            <input value={nomeUsuario} readOnly className="w-full bg-transparent text-[14px] font-medium text-[#15362d] focus:outline-none" />
          </div>
          <div className="rounded-[14px] border border-[#dfeae6] bg-[#f5faf7] p-3">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5d706b]">E-mail</label>
            <input value={emailUsuario} readOnly className="w-full bg-transparent text-[14px] font-medium text-[#15362d] focus:outline-none" />
          </div>
          <div className="rounded-[14px] border border-[#dfeae6] bg-[#f5faf7] p-3">
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5d706b]">Telefone</label>
            <input value={telefoneUsuario} readOnly className="w-full bg-transparent text-[14px] font-medium text-[#15362d] focus:outline-none" />
          </div>
        </div>
      </div>

      <button type="button" className="w-full rounded-[18px] bg-[#0f8b5f] px-4 py-3 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(15,139,95,0.25)]">
        Salvar alterações
      </button>
    </PageFrame>
  );
}

export function Notificacoes() {
  const itens = [
    { titulo: 'Consulta confirmada', texto: 'Sua consulta com Dra. Ana Beatriz foi confirmada para terça, 13/09.', time: 'Hoje • 08:10' },
    { titulo: 'Resultado da IA', texto: 'Sua análise de sintomas foi concluída com orientações iniciais.', time: 'Ontem • 18:40' },
    { titulo: 'Lembrete', texto: 'Não se esqueça de levar seus exames para a próxima consulta.', time: '2 dias atrás' },
  ];

  return (
    <PageFrame title="Notificações" subtitle="Alertas e lembretes" backTo="/">
      <div className="space-y-3">
        {itens.map((item) => (
          <div key={item.titulo} className="rounded-[20px] border border-[#e2e8e4] bg-white p-3 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff3e8] text-[#0f8b5f]">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-[#15362d]">{item.titulo}</div>
                <div className="mt-1 text-[12px] leading-5 text-[#5d706b]">{item.texto}</div>
              </div>
            </div>
            <div className="mt-3 text-[11px] font-semibold text-[#1b8a5c]">{item.time}</div>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}

export default function FluxoPaciente() {
  return <BuscarAtendimento />;
}
