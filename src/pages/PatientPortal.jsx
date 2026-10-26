import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Bell, CalendarDays, Check, ChevronRight, CircleHelp, Clock3,
  CreditCard, FileText, Loader2, LockKeyhole, MapPin, Search,
  Send, ShieldCheck, Star, Stethoscope, X, XCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PatientBottomNav from '../components/PatientBottomNav';
import {
  agendarConsulta, avaliarAgendamento, cancelarAgendamento, getClinicas, getDisponibilidades, getNotificacoes,
  getEspecialidades, getMedicos, getMeusAgendamentos, getProfissional,
  marcarNotificacaoComoLida, reagendarAgendamento, atualizarPerfil, realizarTriagemIa,
} from '../services/api';

const formatDate = (value, options = {}) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric', ...options,
}).format(new Date(value));

const formatDatePart = (value, options) => new Intl.DateTimeFormat('pt-BR', options)
  .format(new Date(`${value}T12:00:00`))
  .replace('.', '');

const initials = (name = '') => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'SR';
const doctorName = (doctor) => doctor?.nome || 'Profissional de saúde';
const doctorSpecialty = (doctor) => doctor?.especialidade || 'Clínica geral';

function Avatar({ name, photo, size = 'normal' }) {
  const dimensions = size === 'large' ? 'h-16 w-16 text-xl' : 'h-11 w-11 text-sm';
  if (photo) return <img className={`${dimensions} shrink-0 rounded-xl object-cover`} src={photo} alt={`Foto de ${name}`} />;
  return <div className={`${dimensions} flex shrink-0 items-center justify-center rounded-xl bg-[#e0f4e9] font-bold text-[#0c925f]`}>{initials(name)}</div>;
}

function Status({ children, tone = 'success' }) {
  const styles = tone === 'danger' ? 'bg-[#fff0f0] text-[#d92d20]' : 'bg-[#e5f6ec] text-[#078653]';
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${styles}`}>{children}</span>;
}

function Rating({ value = 0, total = 0, compact = false }) {
  if (!total) return <span className="text-[10px] text-[#718079]">Sem avaliações</span>;
  return <span className={`inline-flex items-center gap-1 rounded-full bg-[#e5f6ec] font-bold text-[#078653] ${compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-[11px]'}`}><Star size={compact ? 11 : 13} fill="currentColor" />{Number(value).toFixed(1)} <span className="font-medium text-[#5f746a]">({total})</span></span>;
}

function PatientFrame({ title, back = '/', children, action }) {
  return (
    <div className="patient-page min-h-screen bg-[#f7faf8] px-3 py-4 pb-28 sm:px-6 sm:py-7 sm:pb-28">
      <main className="mx-auto w-full max-w-[960px] overflow-hidden rounded-[24px] border border-[#edf1ef] bg-white shadow-[0_14px_35px_rgba(14,47,35,0.08)]">
        <header className="flex min-h-[66px] items-center border-b border-[#eef1f0] px-4 sm:px-6">
          <Link aria-label="Voltar" to={back} className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-[#13251f] transition hover:bg-[#edf8f2]"><ArrowLeft size={19} /></Link>
          <h1 className="flex-1 text-[15px] font-extrabold tracking-[-0.02em] text-[#15251f] sm:text-base">{title}</h1>
          {action}
        </header>
        {children}
      </main>
      <PatientBottomNav />
    </div>
  );
}

function DoctorCard({ doctor, compact = false }) {
  const navigate = useNavigate();
  return (
    <article className={`flex items-center gap-3 rounded-2xl border border-[#e7ece9] bg-white p-3 shadow-[0_3px_10px_rgba(14,47,35,0.035)] ${compact ? '' : 'sm:p-4'}`}>
      <Avatar name={doctorName(doctor)} photo={doctor.fotoUrl} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] font-extrabold text-[#14251f]">{doctorName(doctor)}</h3>
        <p className="mt-0.5 text-[11px] text-[#66756f]">{doctorSpecialty(doctor)}</p>
        {!compact && <p className="mt-1 flex items-center gap-1 text-[10px] text-[#66756f]"><MapPin size={11} />{doctor.clinicaId?.nome || 'Clínica disponível'}{doctor.atendeTelemedicina && <span className="ml-1 rounded-full bg-[#e5f6ec] px-1.5 py-0.5 text-[9px] font-bold text-[#078653]">Telemedicina</span>}</p>}
      </div>
      <div className="shrink-0 text-right"><Rating value={doctor.avaliacao?.media} total={doctor.avaliacao?.total} compact /><button onClick={() => navigate(`/perfil-medico?profissional=${doctor._id}`)} className="mt-2 block text-[11px] font-bold text-[#078653] hover:underline">Ver perfil</button></div>
    </article>
  );
}

export function PatientHome() {
  const { usuario } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const firstName = usuario?.nome?.trim().split(/\s+/)[0] || 'Paciente';

  useEffect(() => {
    Promise.all([getMeusAgendamentos(), getMedicos(), getNotificacoes()])
      .then(([next, availableDoctors, notifications]) => {
        setAppointments(next.filter((item) => item.status !== 'Cancelado' && new Date(item.dataHora) >= new Date()).slice(0, 2));
        setDoctors([...availableDoctors].sort((a, b) => (b.avaliacao?.media || 0) - (a.avaliacao?.media || 0) || (b.avaliacao?.total || 0) - (a.avaliacao?.total || 0)).slice(0, 4));
        setUnreadNotifications(notifications.naoLidas || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="patient-page min-h-screen bg-[#f7faf8] px-3 py-4 pb-28 sm:px-6 sm:py-7 sm:pb-28">
      <main className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1.25fr)_360px]">
        <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_14px_35px_rgba(14,47,35,0.08)]">
          <div className="bg-gradient-to-br from-[#27c67a] to-[#06945d] p-5 text-white sm:p-7">
            <div className="flex items-start justify-between">
              <div><p className="text-[18px] font-extrabold">Olá, {firstName}! <span aria-hidden="true">👋</span></p><p className="mt-5 max-w-[270px] text-[13px] leading-5 text-white/90">Como podemos cuidar de você hoje?</p></div>
              <Link to="/notificacoes" aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25">
                <Bell size={19} />
                {unreadNotifications > 0 && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-[#16ae68] bg-[#ef4444]" />}
              </Link>
            </div>
          </div>
          <div className="space-y-6 p-4 sm:p-6">
            <Link to="/assistente-ia" className="flex items-center gap-3 rounded-2xl border border-[#b8e5cb] bg-[#eaf8f0] p-3 transition hover:-translate-y-0.5 hover:shadow-sm">
              <span className="min-w-0 flex-1"><strong className="block text-[13px] text-[#14251f]">Assistente de IA</strong><small className="mt-1 block text-[11px] text-[#61716b]">Descreva seus sintomas e receba uma orientação inicial</small></span>
              <ChevronRight className="text-[#078653]" size={18} />
            </Link>
            <Link to="/buscar-atendimento" className="flex min-h-[50px] items-center justify-center rounded-xl bg-[#0ba561] px-4 text-[13px] font-extrabold text-white shadow-[0_7px_12px_rgba(5,132,79,.24)] transition hover:bg-[#078c52]">Agendar consulta</Link>

            <section>
              <div className="mb-3 flex items-center justify-between"><h2 className="text-[14px] font-extrabold text-[#172720]">Próximas consultas</h2><Link to="/meus-agendamentos" className="text-[11px] font-bold text-[#078653]">Ver todas</Link></div>
              {loading ? <Loading /> : appointments.length ? <div className="grid gap-3 sm:grid-cols-2">{appointments.map((appointment) => <AppointmentPreview key={appointment._id} appointment={appointment} />)}</div> : <Empty text="Você ainda não tem consultas agendadas." action="Agendar agora" to="/buscar-atendimento" />}
            </section>
          </div>
        </section>
        <aside className="space-y-5 rounded-[24px] bg-white p-4 shadow-[0_14px_35px_rgba(14,47,35,0.08)] sm:p-5">
          <div className="flex items-center justify-between"><h2 className="text-[14px] font-extrabold">Médicos em destaque</h2><Link to="/buscar-atendimento" className="text-[11px] font-bold text-[#078653]">Ver mais</Link></div>
          {loading ? <Loading /> : <div className="space-y-3">{doctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} compact />)}</div>}
          <Link to="/meus-agendamentos" className="flex min-h-[48px] items-center justify-center rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white">Meus agendamentos</Link>
        </aside>
      </main>
      <PatientBottomNav />
    </div>
  );
}

function AppointmentPreview({ appointment }) {
  const doctor = appointment.profissionalId || {};
  return <Link to={`/detalhes-consulta?id=${appointment._id}`} className="block rounded-2xl border border-[#e7ece9] p-3 transition hover:border-[#9cdab9] hover:shadow-sm">
    <div className="flex gap-3"><Avatar name={doctorName(doctor)} photo={doctor.fotoUrl} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><strong className="truncate text-[12px] text-[#182821]">{doctorName(doctor)}</strong><Status>{appointment.status}</Status></div><p className="mt-1 text-[11px] text-[#66756f]">{doctorSpecialty(doctor)}</p><p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-[#178e5f]"><CalendarDays size={12} />{formatDate(appointment.dataHora, { weekday: 'short' })} · {new Date(appointment.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>{appointment.status === 'Concluido' && !appointment.avaliacao && <p className="mt-2 text-[11px] font-bold text-[#078653]">Avalie seu atendimento</p>}</div></div>
  </Link>;
}

function Loading() { return <div className="flex min-h-24 items-center justify-center text-[#078653]"><Loader2 className="animate-spin" size={22} /></div>; }
function Empty({ text, action, to }) { return <div className="rounded-2xl border border-dashed border-[#cfe0d7] p-5 text-center"><p className="text-[12px] text-[#66756f]">{text}</p>{action && <Link to={to} className="mt-3 inline-block text-[12px] font-bold text-[#078653]">{action}</Link>}</div>; }

export function SearchCare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [term, setTerm] = useState(searchParams.get('especialidade') || searchParams.get('busca') || '');
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([getMedicos(), getEspecialidades(), getClinicas()]).then(([m, e, c]) => { setDoctors(m); setSpecialties(e); setClinics(c); }).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => doctors.filter((doctor) => [doctor.nome, doctor.especialidade, doctor.clinicaId?.nome].some((value) => value?.toLowerCase().includes(term.toLowerCase()))), [doctors, term]);
  return <PatientFrame title="Buscar atendimento"><div className="bg-[#f7faf8] p-4 sm:p-6"><div className="mx-auto grid max-w-[840px] gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
    <section className="rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83918c]" size={18} /><input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="Médico, especialidade, clínica..." className="w-full rounded-xl border border-[#e1e8e4] bg-[#fbfdfc] py-3 pl-11 pr-4 text-[13px] outline-none focus:border-[#0ba561] focus:ring-2 focus:ring-[#0ba561]/15" /></div>
      {term && <button onClick={() => setTerm('')} className="filter-chip active mt-4">Limpar busca</button>}
      <p className="mt-5 text-[11px] font-bold text-[#6d7c76]">{filtered.length} profissionais encontrados</p><div className="mt-3 space-y-3">{loading ? <Loading /> : filtered.length ? filtered.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />) : <Empty text="Nenhum profissional encontrado." />}</div>
    </section>
    <aside className="rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><div className="flex items-center justify-between"><h2 className="text-[14px] font-extrabold">Especialidades</h2><Stethoscope size={16} className="text-[#078653]" /></div><p className="mt-1 text-[11px] leading-4 text-[#66756f]">Escolha a especialidade que precisa.</p><div className="mt-4 space-y-2">{specialties.slice(0, 6).map((item) => <button key={item._id || item.especialidade} onClick={() => setTerm(item.nome || item.especialidade)} className="flex w-full items-center justify-between rounded-xl border border-[#e7ece9] p-3 text-left transition hover:border-[#0ba561]"><span><strong className="block text-[12px]">{item.nome || item.especialidade}</strong><small className="text-[10px] text-[#718079]">Ver profissionais</small></span><ChevronRight size={15} className="text-[#718079]" /></button>)}</div><div className="mt-4 border-t border-[#edf1ef] pt-4"><p className="text-[11px] font-bold text-[#66756f]">Por clínica</p>{clinics.slice(0, 2).map((clinic) => <button key={clinic._id} onClick={() => setTerm(clinic.nome)} className="mt-2 flex w-full items-center gap-2 text-left text-[11px] font-semibold text-[#078653]"><MapPin size={13} />{clinic.nome}</button>)}<button onClick={() => navigate('/unidades')} className="mt-3 text-[11px] font-bold text-[#078653] underline">Ver unidades</button></div></aside>
  </div>
  </div></PatientFrame>;
}

export function DoctorProfile() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const id = params.get('profissional');
  const [data, setData] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (id) getProfissional(id).then(setData).finally(() => setLoading(false)); else setLoading(false); }, [id]);
  if (loading) return <PatientFrame title="Perfil do médico" back="/buscar-atendimento"><Loading /></PatientFrame>;
  const doctor = data?.profissional;
  if (!doctor) return <PatientFrame title="Perfil do médico" back="/buscar-atendimento"><div className="p-6"><Empty text="Profissional não encontrado." /></div></PatientFrame>;
  const clinic = doctor.clinicaId || {};
  const hasSlots = Boolean(data.agendaDisponivel?.length);
  return <PatientFrame title="Perfil do médico" back="/buscar-atendimento"><div className="bg-[#f7faf8] p-4 sm:p-6"><div className="mx-auto max-w-[600px] space-y-4"><section className="rounded-2xl bg-white p-5 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><div className="flex items-start gap-4"><Avatar name={doctor.nome} photo={doctor.fotoUrl} size="large" /><div className="min-w-0 flex-1"><h2 className="text-[18px] font-extrabold">{doctor.nome}</h2><p className="mt-1 text-[12px] text-[#66756f]">{doctor.especialidade}</p><p className="mt-1 text-[11px] text-[#66756f]">CRM/PE {doctor.crm}</p><div className="mt-2 flex flex-wrap gap-2"><Status>{doctor.atendeTelemedicina ? 'Presencial e telemedicina' : 'Atendimento presencial'}</Status><Rating value={doctor.avaliacao?.media} total={doctor.avaliacao?.total} /></div></div></div>{doctor.bio && <div className="mt-5 rounded-xl bg-[#f7faf8] p-3"><h3 className="text-[10px] font-extrabold uppercase tracking-wide text-[#62716b]">Apresentação profissional</h3><p className="mt-2 text-[12px] leading-5 text-[#53635d]">{doctor.bio}</p></div>}</section><section className="rounded-2xl bg-white p-5 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><h3 className="text-[11px] font-extrabold uppercase tracking-wide text-[#687871]">Local de atendimento</h3><div className="mt-4 space-y-4 text-[12px]"><p><span className="block text-[#718079]">Clínica</span><strong>{clinic.nome || 'Não informada'}</strong></p><p><span className="block text-[#718079]">Endereço</span><strong>{clinic.endereco || 'Não informado'}{clinic.bairro ? ` — ${clinic.bairro}` : ''}</strong></p><p><span className="block text-[#718079]">Próximo horário livre</span><strong>{hasSlots ? `${formatDate(data.agendaDisponivel[0].dataHora || data.agendaDisponivel[0])} às ${new Date(data.agendaDisponivel[0].dataHora || data.agendaDisponivel[0]).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${data.agendaDisponivel[0].tipo}` : 'Nenhum horário disponível'}</strong></p></div></section><button disabled={!hasSlots} onClick={() => navigate(`/agendar-consulta?profissional=${doctor._id}`)} className="flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white shadow-[0_7px_12px_rgba(5,132,79,.24)] disabled:cursor-not-allowed disabled:opacity-50">{hasSlots ? 'Agendar consulta' : 'Sem horários disponíveis'}</button></div></div></PatientFrame>;
}

export function ScheduleAppointment() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const id = params.get('profissional');
  const [doctor, setDoctor] = useState(null); const [slots, setSlots] = useState([]); const [selected, setSelected] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  useEffect(() => { if (!id) return; Promise.all([getProfissional(id), getDisponibilidades({ profissionalId: id })]).then(([details, available]) => { setDoctor(details.profissional); setSlots(available); if (available[0]) setSelected(available[0]._id); }).catch(() => setError('Não foi possível carregar a agenda.')); }, [id]);
  const days = useMemo(() => [...new Map(slots.map((slot) => [new Date(slot.dataHora).toISOString().slice(0, 10), true])).keys()], [slots]);
  const [day, setDay] = useState('');
  useEffect(() => { if (!day && days[0]) setDay(days[0]); }, [day, days]);
  const daySlots = slots.filter((slot) => slot.dataHora.slice(0, 10) === day);
  const selectedSlot = slots.find((item) => item._id === selected);
  const submit = async () => {
    const slot = selectedSlot;
    const clinic = doctor?.clinicaId || slot?.clinicaId;
    const clinicaId = typeof clinic === 'object' ? clinic?._id : clinic;

    if (!slot || !doctor) {
      setError('Selecione um horário disponível.');
      return;
    }

    if (!clinicaId) {
      setError('Não foi possível identificar a clínica deste profissional. Atualize a página e tente novamente.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const appointment = await agendarConsulta({
        profissionalId: doctor._id,
        clinicaId,
        dataHora: slot.dataHora,
        tipo: slot.tipo,
      });
      navigate(`/consulta-sucesso?id=${appointment._id}`);
    } catch (err) {
      setError(err.response?.data?.message || (err.request
        ? 'Não foi possível conectar à API. Verifique se o backend está em execução na porta 5000.'
        : 'Não foi possível preparar o agendamento. Tente novamente.'));
    } finally {
      setSaving(false);
    }
  };
  if (!id) return <PatientFrame title="Agendar consulta" back="/buscar-atendimento"><div className="p-6"><Empty text="Escolha um profissional antes de agendar." action="Buscar profissionais" to="/buscar-atendimento" /></div></PatientFrame>;
  return <PatientFrame title="Agendar consulta" back={`/perfil-medico?profissional=${id}`}><div className="bg-[#f7faf8] p-4 sm:p-6"><div className="mx-auto max-w-[600px] space-y-4"><aside className="rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]">{doctor ? <div className="flex items-center gap-3"><Avatar name={doctor.nome} photo={doctor.fotoUrl} /><div><strong className="block text-[13px]">{doctor.nome}</strong><span className="text-[11px] text-[#66756f]">{doctor.especialidade} · {doctor.clinicaId?.nome}</span></div></div> : <Loading />}</aside><section className="rounded-2xl bg-white p-5 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><div className="rounded-xl bg-[#eaf8f0] p-3 text-[12px] text-[#176445]"><strong className="block">Modalidade definida pelo horário</strong><span className="mt-1 block">{selectedSlot ? selectedSlot.tipo : 'Selecione um horário disponível'}</span></div><h2 className="mt-7 text-[13px] font-extrabold">Selecione a data</h2><div className="mt-3 flex flex-wrap gap-2">{days.map((value) => <button key={value} onClick={() => { setDay(value); const next = slots.find((slot) => slot.dataHora.slice(0, 10) === value); setSelected(next?._id || ''); }} className={`date-button ${day === value ? 'selected' : ''}`}><span>{formatDatePart(value, { weekday: 'short' })}</span><strong>{new Date(`${value}T12:00:00`).getDate()}</strong><small>{formatDatePart(value, { month: 'short' })}</small></button>)}</div><h2 className="mt-7 text-[13px] font-extrabold">Horários disponíveis</h2><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{daySlots.map((slot) => <button key={slot._id} onClick={() => setSelected(slot._id)} className={`time-button ${selected === slot._id ? 'selected' : ''}`}><span className="block">{new Date(slot.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span><small className="block text-[9px] font-medium opacity-80">{slot.tipo}</small></button>)}</div>{!slots.length && <p className="mt-3 text-[12px] text-[#66756f]">Este profissional não possui horários disponíveis no momento.</p>}{error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-[12px] font-semibold text-[#c22920]">{error}</p>}<button disabled={saving || !selected} onClick={submit} className="mt-7 flex min-h-[50px] w-full items-center justify-center rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white shadow-[0_7px_12px_rgba(5,132,79,.24)] disabled:opacity-50">{saving ? 'Confirmando...' : 'Confirmar agendamento'}</button></section></div></div></PatientFrame>;
}

export function MyAppointments() {
  const [appointments, setAppointments] = useState([]); const [loading, setLoading] = useState(true); const [mode, setMode] = useState('upcoming');
  useEffect(() => { getMeusAgendamentos().then(setAppointments).finally(() => setLoading(false)); }, []);
  const filtered = appointments.filter((item) => mode === 'upcoming' ? new Date(item.dataHora) >= new Date() && item.status !== 'Cancelado' : new Date(item.dataHora) < new Date() || item.status === 'Cancelado');
  return <PatientFrame title="Meus agendamentos"><div className="bg-[#f7faf8] p-4 sm:p-6"><div className="mx-auto max-w-[600px]"><div className="mb-5 grid grid-cols-2 border-b border-[#dce9e1] bg-white"><button onClick={() => setMode('upcoming')} className={`tab-button rounded-none ${mode === 'upcoming' ? 'active border-b-2 border-[#0ba561]' : ''}`}>Próximos</button><button onClick={() => setMode('history')} className={`tab-button rounded-none ${mode === 'history' ? 'active border-b-2 border-[#0ba561]' : ''}`}>Histórico</button></div>{loading ? <Loading /> : filtered.length ? <div className="space-y-3">{filtered.map((appointment) => <AppointmentPreview key={appointment._id} appointment={appointment} />)}</div> : <Empty text="Nenhum agendamento encontrado nesta seção." action="Agendar consulta" to="/buscar-atendimento" />}</div></div></PatientFrame>;
}

export function AppointmentDetails() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const [appointment, setAppointment] = useState(null); const [loading, setLoading] = useState(true); const [cancelling, setCancelling] = useState(false); const [rating, setRating] = useState(0); const [comment, setComment] = useState(''); const [ratingError, setRatingError] = useState(''); const [sendingRating, setSendingRating] = useState(false); const id = params.get('id');
  useEffect(() => { getMeusAgendamentos().then((items) => setAppointment(items.find((item) => item._id === id) || null)).finally(() => setLoading(false)); }, [id]);
  const cancel = async () => { if (!appointment || !window.confirm('Deseja cancelar esta consulta?')) return; setCancelling(true); try { await cancelarAgendamento(appointment._id); navigate(`/consulta-cancelada?id=${appointment._id}`); } finally { setCancelling(false); } };
  const sendRating = async (event) => { event.preventDefault(); if (!rating) { setRatingError('Escolha de 1 a 5 estrelas para enviar sua avaliação.'); return; } setSendingRating(true); setRatingError(''); try { const response = await avaliarAgendamento(appointment._id, { nota: rating, comentario: comment }); setAppointment((current) => ({ ...current, avaliacao: response.avaliacao })); } catch (requestError) { setRatingError(requestError.response?.data?.message || 'Não foi possível enviar sua avaliação.'); } finally { setSendingRating(false); } };
  if (loading) return <PatientFrame title="Detalhes da consulta" back="/meus-agendamentos"><Loading /></PatientFrame>;
  if (!appointment) return <PatientFrame title="Detalhes da consulta" back="/meus-agendamentos"><div className="p-6"><Empty text="Agendamento não encontrado." /></div></PatientFrame>;
  const doctor = appointment.profissionalId || {}; const clinic = appointment.clinicaId || {}; const completed = appointment.status === 'Concluido'; const summary = appointment.resumoAtendimento;
  return <PatientFrame title="Detalhes da consulta" back="/meus-agendamentos"><div className="mx-auto max-w-3xl bg-[#f7faf8] p-4 sm:p-6"><section className="rounded-2xl bg-white p-4"><div className="flex items-center gap-3"><Avatar name={doctorName(doctor)} photo={doctor.fotoUrl} /><div className="min-w-0 flex-1"><strong className="block text-[13px]">{doctorName(doctor)}</strong><span className="text-[11px] text-[#66756f]">{doctorSpecialty(doctor)} · {doctor.crm}</span></div><Status tone={appointment.status === 'Cancelado' ? 'danger' : 'success'}>{appointment.status}</Status></div></section><section className="mt-4 rounded-2xl bg-white p-5"><h2 className="text-[12px] font-extrabold uppercase tracking-wide text-[#293831]">Informações</h2><div className="mt-4 grid gap-4 text-[12px] sm:grid-cols-2"><Info label="Data e horário" value={`${formatDate(appointment.dataHora)} às ${new Date(appointment.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`} /><Info label="Tipo" value={appointment.tipo} /><Info label="Clínica" value={clinic.nome} /><Info label="Endereço" value={`${clinic.endereco || ''} ${clinic.bairro ? `— ${clinic.bairro}` : ''}`} /></div>{appointment.instrucoes && <div className="mt-5 rounded-xl bg-[#e6f6ec] p-3 text-[12px] text-[#1a6546]"><strong className="block">Instruções</strong>{appointment.instrucoes}</div>}</section>{completed && summary && <section className="mt-4 rounded-2xl bg-white p-5"><h2 className="text-[12px] font-extrabold uppercase tracking-wide text-[#293831]">Orientações do atendimento</h2>{summary.conduta ? <p className="mt-3 whitespace-pre-wrap text-[12px] leading-5 text-[#53635d]">{summary.conduta}</p> : <p className="mt-3 text-[12px] text-[#66756f]">O profissional não registrou orientações adicionais.</p>}{summary.retornoEmDias && <div className="mt-4 rounded-xl bg-[#eaf8f0] p-3"><strong className="block text-[12px] text-[#176445]">Retorno recomendado em {summary.retornoEmDias} dias</strong><button onClick={() => navigate(`/agendar-consulta?profissional=${doctor._id}&retorno=${appointment._id}`)} className="mt-3 min-h-[40px] rounded-lg bg-[#0ba561] px-4 text-[11px] font-extrabold text-white">Agendar retorno</button></div>}</section>}{completed && <section className="mt-4 rounded-2xl bg-white p-5"><h2 className="text-[13px] font-extrabold">Como foi seu atendimento?</h2>{appointment.avaliacao ? <div className="mt-3"><Rating value={appointment.avaliacao.nota} total={1} /><p className="mt-3 text-[12px] text-[#53635d]">Obrigado pela sua avaliação.</p>{appointment.avaliacao.comentario && <p className="mt-2 text-[12px] italic text-[#66756f]">“{appointment.avaliacao.comentario}”</p>}</div> : <form onSubmit={sendRating} className="mt-4"><div className="flex gap-2" aria-label="Avaliação em estrelas">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} estrela${value > 1 ? 's' : ''}`} className={`flex h-10 w-10 items-center justify-center rounded-xl ${value <= rating ? 'bg-[#e5f6ec] text-[#078653]' : 'bg-[#f3f6f4] text-[#a2afa8]'}`}><Star size={20} fill={value <= rating ? 'currentColor' : 'none'} /></button>)}</div><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={500} placeholder="Conte brevemente como foi, se desejar." className="mt-4 min-h-[78px] w-full rounded-xl border border-[#dfe8e3] p-3 text-[12px] outline-none focus:border-[#0ba561]" />{ratingError && <p role="alert" className="mt-3 text-[12px] font-semibold text-[#c22920]">{ratingError}</p>}<button disabled={sendingRating} className="mt-4 min-h-[44px] rounded-xl bg-[#0ba561] px-5 text-[12px] font-extrabold text-white disabled:opacity-60">{sendingRating ? 'Enviando...' : 'Enviar avaliação'}</button></form>}</section>}{appointment.status === 'Confirmado' && <div className="mt-4 grid gap-3 sm:grid-cols-2"><button onClick={() => navigate(`/reagendar-consulta?id=${appointment._id}&profissional=${doctor._id}`)} className="min-h-[48px] rounded-xl bg-[#0ba561] text-[12px] font-extrabold text-white">Reagendar consulta</button><button onClick={cancel} disabled={cancelling} className="min-h-[48px] rounded-xl border border-[#ef4444] text-[12px] font-extrabold text-[#d92d20]">{cancelling ? 'Cancelando...' : 'Cancelar consulta'}</button></div>}</div></PatientFrame>;
}
function Info({ label, value }) { return <p><span className="block text-[#718079]">{label}</span><strong className="mt-1 block leading-5 text-[#24342d]">{value || 'Não informado'}</strong></p>; }

export function AppointmentSuccess() { return <PatientFrame title="Agendar consulta" back="/"><div className="flex min-h-[470px] flex-col items-center justify-center p-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0ba561] text-white"><Check size={32} /></div><h2 className="mt-5 text-[22px] font-extrabold">Consulta agendada!</h2><p className="mt-2 max-w-sm text-[13px] leading-5 text-[#66756f]">Seu agendamento foi confirmado. Você pode ver os dados e instruções na área de consultas.</p><Link to="/meus-agendamentos" className="mt-7 flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white">Ver meus agendamentos</Link><Link to="/" className="mt-4 text-[12px] text-[#66756f]">Voltar ao início</Link></div></PatientFrame>; }
export function AppointmentCancelled() { return <PatientFrame title="Consulta cancelada" back="/meus-agendamentos"><div className="flex min-h-[470px] flex-col items-center justify-center p-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe4e4] text-[#d92d20]"><XCircle size={32} /></div><h2 className="mt-5 text-[22px] font-extrabold">Consulta cancelada</h2><p className="mt-2 max-w-sm text-[13px] leading-5 text-[#66756f]">Sua consulta foi cancelada com sucesso. Esperamos que você possa reagendar em breve.</p><Link to="/buscar-atendimento" className="mt-7 flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white">Agendar nova consulta</Link><Link to="/meus-agendamentos" className="mt-4 text-[12px] text-[#66756f]">Ver agendamentos</Link></div></PatientFrame>; }

export function HealthAssistant() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    const queixa = message.trim();
    if (!queixa || result) return;
    setLoading(true);
    setError('');
    setSubmittedMessage(queixa);
    setMessage('');
    try {
      setResult(await realizarTriagemIa(queixa));
    } catch (requestError) {
      setSubmittedMessage('');
      setError(requestError.response?.data?.message || 'Não foi possível analisar sua mensagem agora.');
    } finally {
      setLoading(false);
    }
  };
  const startNewTicket = () => { setMessage(''); setSubmittedMessage(''); setResult(null); setError(''); };
  return <PatientFrame title="Assistente de IA" back="/"><div className="mx-auto max-w-3xl bg-[#f7faf8] p-4 sm:p-6"><section className="rounded-2xl bg-white p-5"><div className="border-b border-[#eef1ef] pb-4"><strong className="block text-[13px]">Assistente de IA</strong><span className="text-[11px] text-[#0f8b5f]">● Online agora</span></div><div className="mt-5 space-y-3"><div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-[#f4faf7] p-3 text-[12px] leading-5 text-[#44534d]">Olá! Sou o Assistente de IA do Saúde Recife. Descreva o que você está sentindo e eu tento ajudar a encontrar o cuidado certo.</div>{submittedMessage && <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#e6f4ea] p-3 text-[12px] leading-5 text-[#1a6546]">{submittedMessage}</div>}{result && <div className="rounded-2xl border border-[#dcebe2] bg-white p-4"><strong className="text-[13px]">Orientação inicial</strong><div className="mt-3 flex flex-wrap gap-2">{result.sintomasIdentificados?.map((symptom) => <span key={symptom} className="rounded-full bg-[#e6f4ea] px-2.5 py-1 text-[10px] font-bold text-[#0f8b5f]">{symptom}</span>)}</div><p className="mt-4 text-[11px] text-[#6b7280]">Especialidade recomendada</p><p className="mt-1 text-lg font-extrabold text-[#0f8b5f]">{result.especialidadeRecomendada}</p><p className="mt-4 text-[12px] leading-5 text-[#44534d]">{result.observacoes}</p>{result.alertaEmergencia && <p className="mt-4 rounded-xl border border-[#fff085] bg-[#fefce8] p-3 text-[12px] font-semibold text-[#9a6700]">Atenção: se houver piora importante ou emergência, ligue 192 (SAMU) ou procure atendimento imediato.</p>}<button onClick={() => navigate(`/buscar-atendimento?especialidade=${encodeURIComponent(result.especialidadeRecomendada)}`)} className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#0ba561] text-[12px] font-extrabold text-white">Encontrar profissionais</button><button onClick={startNewTicket} className="mt-2 flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#dfe8e3] text-[12px] font-extrabold text-[#53635d]">Novo atendimento</button></div>}</div><form onSubmit={submit} className="mt-5 flex gap-2"><input value={message} onChange={(event) => setMessage(event.target.value)} disabled={Boolean(result)} placeholder={result ? 'Atendimento finalizado' : 'Descreva o que está sentindo...'} className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-[#dfe8e3] px-3 text-[12px] outline-none focus:border-[#0f8b5f] disabled:cursor-not-allowed disabled:bg-[#f4f6f5]" />{message && !result && <button type="button" onClick={() => setMessage('')} className="rounded-xl px-2 text-[11px] font-bold text-[#718079]">Limpar</button>}<button disabled={loading || !message.trim() || Boolean(result)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f8b5f] text-white disabled:opacity-50" aria-label="Enviar mensagem">{loading ? <Loader2 className="animate-spin" size={19} /> : <Send size={18} />}</button></form>{error && <p role="alert" className="mt-3 rounded-xl bg-[#fff0f0] p-3 text-[12px] font-semibold text-[#c22920]">{error}</p>}<p className="mt-4 text-[10px] leading-4 text-[#7a8781]">Esta orientação é informativa e não substitui uma consulta ou diagnóstico médico.</p></section></div></PatientFrame>;
}

export function PatientProfile() {
  const { usuario, logout } = useAuth(); const navigate = useNavigate(); const name = usuario?.nome || 'Paciente';
  return <PatientFrame title="Meu perfil"><div className="mx-auto max-w-[600px] bg-[#f7faf8] p-4 sm:p-6"><section className="rounded-2xl bg-white p-5 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><div className="flex items-center gap-4"><Avatar name={name} size="large" /><div className="min-w-0"><h2 className="truncate text-[18px] font-extrabold">{name}</h2><p className="mt-1 truncate text-[12px] text-[#66756f]">{usuario?.email}</p><Status>{usuario?.tipo === 'PACIENTE' ? 'Paciente' : usuario?.tipo}</Status></div></div><div className="mt-6 rounded-xl border border-[#edf1ef] px-4 py-3"><h3 className="text-[10px] font-extrabold uppercase tracking-wide text-[#62716b]">Dados pessoais</h3><div className="mt-3 grid gap-3 text-[12px] sm:grid-cols-2"><Info label="Nome completo" value={name} /><Info label="CPF" value={usuario?.cpf ? `***.***.***-${String(usuario.cpf).slice(-2)}` : 'Não informado'} /><Info label="Data de nascimento" value={usuario?.dataNascimento ? formatDate(usuario.dataNascimento) : 'Não informada'} /><Info label="Telefone" value={usuario?.telefone} /></div></div></section><div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><ProfileLink to="/privacidade" icon={ShieldCheck} label="Privacidade e segurança" /><ProfileLink to="/plano-saude" icon={CreditCard} label="Plano de saúde" /><ProfileLink to="/ajuda" icon={CircleHelp} label="Ajuda e suporte" /><ProfileLink to="/termos" icon={FileText} label="Termos de uso" last /></div><Link to="/editar-perfil" className="mt-4 flex min-h-[48px] items-center justify-center rounded-xl bg-[#0ba561] text-[12px] font-extrabold text-white shadow-[0_7px_12px_rgba(5,132,79,.24)]">Editar informações</Link><button onClick={() => { logout(); navigate('/login'); }} className="mt-2 flex min-h-[48px] w-full items-center justify-center rounded-xl border border-[#ef4444] bg-white text-[12px] font-extrabold text-[#d92d20]">Sair da conta</button></div></PatientFrame>;
}

function ProfileLink({ to, icon: Icon, label, last = false }) { return <Link to={to} className={`flex items-center gap-3 px-4 py-4 text-[12px] font-bold text-[#25362f] ${last ? '' : 'border-b border-[#edf1ef]'}`}><Icon size={16} className="text-[#078653]" /><span className="flex-1">{label}</span><ChevronRight size={16} className="text-[#86938e]" /></Link>; }

const toBirthDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()}`;
};

const formatBirthDateInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const formatPhoneInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const toApiBirthDate = (value) => {
  if (!value) return '';
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day) || date > new Date()) return null;
  return `${year}-${month}-${day}`;
};

export function EditPatientProfile() {
  const { usuario, atualizarUsuarioLocal } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: usuario?.nome || '',
    email: usuario?.email || '',
    telefone: formatPhoneInput(usuario?.telefone || ''),
    dataNascimento: toBirthDateInput(usuario?.dataNascimento),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === 'dataNascimento'
      ? formatBirthDateInput(value)
      : name === 'telefone' ? formatPhoneInput(value) : value;
    setForm((current) => ({ ...current, [name]: formattedValue }));
  };
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    const dataNascimento = toApiBirthDate(form.dataNascimento);
    if (form.dataNascimento && !dataNascimento) {
      setError('Informe uma data de nascimento válida no formato DD/MM/AAAA.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }
    setSaving(true);
    try {
      const response = await atualizarPerfil({ ...form, dataNascimento });
      atualizarUsuarioLocal(response.usuario);
      navigate('/perfil');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível atualizar seus dados.');
    } finally {
      setSaving(false);
    }
  };

  return <PatientFrame title="Editar informações" back="/perfil"><form onSubmit={submit} className="mx-auto max-w-2xl bg-[#f7faf8] p-4 sm:p-6"><section className="rounded-2xl bg-white p-5"><div className="mb-6 flex items-center gap-3"><Avatar name={form.nome} size="large" /><div><strong className="block text-[14px]">{form.nome || 'Paciente'}</strong><span className="text-[12px] text-[#66756f]">Atualize seus dados de contato.</span></div></div><div className="grid gap-4"><label className="form-label">Nome completo<input required name="nome" value={form.nome} onChange={updateField} className="form-input" /></label><label className="form-label">E-mail<input required name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" className="form-input" /></label><label className="form-label">Telefone<input name="telefone" value={form.telefone} onChange={updateField} inputMode="tel" autoComplete="tel" placeholder="(81) 9 9238-2938" className="form-input" /></label><label className="form-label">Data de nascimento<input name="dataNascimento" value={form.dataNascimento} onChange={updateField} type="text" inputMode="numeric" autoComplete="bday" placeholder="DD/MM/AAAA" maxLength={10} className="form-input" /></label></div>{error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-[12px] font-semibold text-[#c22920]">{error}</p>}<div className="mt-6 grid gap-3 sm:grid-cols-2"><button disabled={saving} className="min-h-[48px] rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white disabled:opacity-60">{saving ? 'Salvando...' : 'Concluir'}</button><Link to="/perfil" className="flex min-h-[48px] items-center justify-center rounded-xl border border-[#dfe8e3] text-[13px] font-extrabold text-[#53635d]">Cancelar</Link></div></section></form></PatientFrame>;
}

export function RescheduleAppointment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const appointmentId = params.get('id');
  const doctorId = params.get('profissional');
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState('');
  const [day, setDay] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) return;
    getDisponibilidades({ profissionalId: doctorId })
      .then((available) => {
        setSlots(available);
        if (available[0]) setSelected(available[0]._id);
      })
      .catch(() => setError('Não foi possível carregar os horários disponíveis.'));
  }, [doctorId]);
  const days = useMemo(() => [...new Set(slots.map((slot) => slot.dataHora.slice(0, 10)))], [slots]);
  useEffect(() => { if (!day && days[0]) setDay(days[0]); }, [day, days]);
  const daySlots = slots.filter((slot) => slot.dataHora.slice(0, 10) === day);
  const submit = async () => {
    const slot = slots.find((item) => item._id === selected);
    if (!appointmentId || !slot) return setError('Selecione um horário para continuar.');
    setSaving(true);
    setError('');
    try {
      await reagendarAgendamento(appointmentId, { dataHora: slot.dataHora, tipo: slot.tipo });
      navigate(`/detalhes-consulta?id=${appointmentId}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Não foi possível reagendar a consulta.');
    } finally {
      setSaving(false);
    }
  };
  if (!appointmentId || !doctorId) return <PatientFrame title="Reagendar consulta" back="/meus-agendamentos"><div className="p-6"><Empty text="Agendamento não encontrado." /></div></PatientFrame>;
  return <PatientFrame title="Reagendar consulta" back={`/detalhes-consulta?id=${appointmentId}`}><div className="mx-auto max-w-3xl bg-[#f7faf8] p-4 sm:p-6"><section className="rounded-2xl bg-white p-5"><p className="rounded-xl bg-[#e6f6ec] p-3 text-[12px] text-[#176445]">Escolha uma nova data e horário disponíveis. Sua consulta atual será atualizada após a confirmação.</p><h2 className="mt-6 text-[13px] font-extrabold">Nova data</h2><div className="mt-3 flex flex-wrap gap-2">{days.map((value) => <button key={value} onClick={() => { setDay(value); const first = slots.find((slot) => slot.dataHora.slice(0, 10) === value); setSelected(first?._id || ''); }} className={`date-button ${day === value ? 'selected' : ''}`}><span>{formatDatePart(value, { weekday: 'short' })}</span><strong>{new Date(`${value}T12:00:00`).getDate()}</strong><small>{formatDatePart(value, { month: 'short' })}</small></button>)}</div><h2 className="mt-7 text-[13px] font-extrabold">Novo horário</h2><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{daySlots.map((slot) => <button key={slot._id} onClick={() => setSelected(slot._id)} className={`time-button ${selected === slot._id ? 'selected' : ''}`}>{new Date(slot.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</button>)}</div>{!slots.length && <p className="mt-4 text-[12px] text-[#66756f]">Não há horários disponíveis no momento.</p>}{error && <p role="alert" className="mt-5 rounded-xl bg-[#fff0f0] p-3 text-[12px] font-semibold text-[#c22920]">{error}</p>}<button onClick={submit} disabled={saving || !selected} className="mt-7 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0ba561] text-[13px] font-extrabold text-white disabled:opacity-60">{saving ? 'Reagendando...' : 'Confirmar reagendamento'}</button></section></div></PatientFrame>;
}

export function PatientNotifications() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const navigate = useNavigate();
  useEffect(() => { getNotificacoes().then(({ notificacoes }) => setItems(notificacoes)).finally(() => setLoading(false)); }, []);
  const open = async (item) => { try { if (!item.lidaEm) await marcarNotificacaoComoLida(item._id); } finally { navigate(item.link); } };
  return <PatientFrame title="Notificações" back="/"><div className="mx-auto max-w-[600px] bg-[#f7faf8] p-4 sm:p-6">{loading ? <Loading /> : items.length ? <div className="overflow-hidden rounded-2xl bg-white shadow-[0_3px_12px_rgba(14,47,35,0.035)]">{items.map((item, index) => <button key={item._id} onClick={() => open(item)} className={`flex w-full gap-3 p-4 text-left ${index ? 'border-t border-[#edf1ef]' : ''}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.lidaEm ? 'bg-[#d2ddd7]' : 'bg-[#0ba561]'}`} /><span><strong className="block text-[13px]">{item.titulo}</strong><span className="mt-1 block text-[12px] leading-5 text-[#66756f]">{item.descricao}</span></span></button>)}</div> : <Empty text="Você não tem notificações no momento." />}</div></PatientFrame>;
}

export function HealthPlan() {
  return <PatientFrame title="Plano de Saúde" back="/perfil"><div className="mx-auto max-w-[600px] bg-[#f7faf8] p-4 sm:p-6"><Empty text="Nenhum plano de saúde cadastrado." /><p className="mt-4 rounded-xl bg-[#fff5df] p-3 text-[11px] leading-4 text-[#865a16]"><strong>Antes do atendimento</strong><br />Confirme a cobertura com o plano antes do atendimento.</p></div></PatientFrame>;
}

export function PrivacyAndSecurity() {
  const { usuario, atualizarUsuarioLocal } = useAuth();
  const [preferences, setPreferences] = useState({
    ocultarDetalhesNotificacoes: Boolean(usuario?.preferenciasPrivacidade?.ocultarDetalhesNotificacoes),
    compartilharDadosUso: Boolean(usuario?.preferenciasPrivacidade?.compartilharDadosUso),
  });
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const togglePreference = async (key) => {
    const updatedPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(updatedPreferences);
    setSaving(key);
    setError('');
    try {
      const response = await atualizarPerfil({ preferenciasPrivacidade: updatedPreferences });
      atualizarUsuarioLocal(response.usuario);
    } catch (requestError) {
      setPreferences(preferences);
      setError(requestError.response?.data?.message || 'Não foi possível salvar sua preferência.');
    } finally {
      setSaving('');
    }
  };
  return <PatientFrame title="Privacidade e Segurança" back="/perfil"><div className="mx-auto max-w-[600px] space-y-4 bg-[#f7faf8] p-4 sm:p-6"><section className="overflow-hidden rounded-2xl bg-white px-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><h2 className="pt-4 text-[13px] font-extrabold">Preferências de privacidade</h2><PrivacyToggle label="Ocultar detalhes nas notificações" description="Mostra apenas um aviso, sem detalhes de consultas na tela bloqueada." enabled={preferences.ocultarDetalhesNotificacoes} saving={saving === 'ocultarDetalhesNotificacoes'} onClick={() => togglePreference('ocultarDetalhesNotificacoes')} /><PrivacyToggle label="Compartilhar dados de uso" description="Ajuda a melhorar o aplicativo com dados de uso não identificáveis." enabled={preferences.compartilharDadosUso} saving={saving === 'compartilharDadosUso'} onClick={() => togglePreference('compartilharDadosUso')} /></section>{error && <p role="alert" className="rounded-xl bg-[#fff0f0] p-3 text-[12px] font-semibold text-[#c22920]">{error}</p>}<section className="rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><h2 className="text-[13px] font-extrabold">Seus dados</h2><p className="mt-2 text-[11px] leading-5 text-[#718079]">Os dados cadastrais são usados para organizar seus atendimentos e podem ser atualizados no perfil.</p></section></div></PatientFrame>;
}

function PrivacyToggle({ label, description, enabled, saving, onClick }) { return <div className="flex items-center gap-3 border-t border-[#edf1ef] py-4 first:mt-3"><div className="flex-1"><strong className="block text-[12px] text-[#25362f]">{label}</strong><span className="mt-1 block text-[10px] leading-4 text-[#718079]">{description}</span></div><button type="button" role="switch" aria-checked={enabled} aria-label={label} disabled={saving} onClick={onClick} className={`h-6 w-11 rounded-full p-0.5 transition ${enabled ? 'bg-[#0ba561]' : 'bg-[#94a3b8]'} disabled:opacity-60`}><span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} /></button></div>; }

export function HelpSupport() {
  const [text, setText] = useState('');
  const questions = ['Como agendar uma consulta?', 'Como reagendar ou cancelar?', 'Não consigo acessar a conta', 'Como usar o Modo Sênior?'];
  return <PatientFrame title="Ajuda e Suporte" back="/perfil"><div className="mx-auto max-w-[600px] bg-[#f7faf8] p-4 sm:p-6"><h2 className="mb-3 text-[13px] font-extrabold">Dúvidas frequentes</h2><section className="overflow-hidden rounded-2xl bg-white shadow-[0_3px_12px_rgba(14,47,35,0.035)]">{questions.map((question, index) => <details key={question} className={index ? 'border-t border-[#edf1ef]' : ''}><summary className="cursor-pointer list-none px-4 py-4 text-[12px] font-bold text-[#25362f]">ⓘ {question}</summary><p className="px-4 pb-4 text-[11px] leading-5 text-[#718079]">Na área de agendamentos, escolha a opção desejada e siga as instruções exibidas na tela.</p></details>)}</section><section className="mt-4 rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><h3 className="text-[12px] font-extrabold">Ainda precisa de ajuda?</h3><p className="mt-1 text-[11px] text-[#718079]">Envie uma mensagem sobre sua dúvida.</p><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Descreva o que aconteceu e em qual etapa precisa de ajuda." className="mt-3 min-h-24 w-full rounded-xl border border-[#dfe8e3] p-3 text-[12px] outline-none focus:border-[#0ba561]" /><button className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#0ba561] text-[12px] font-extrabold text-white">Enviar solicitação</button></section><p className="mt-3 rounded-xl border border-[#ffd5d1] bg-[#fff5f4] p-3 text-[10px] leading-4 text-[#ba3024]"><strong>Emergência: ligue 192 (SAMU)</strong><br />Este suporte é administrativo e não oferece atendimento médico.</p></div></PatientFrame>;
}

export function TermsOfUse() {
  const sections = [['1. Uso do app', 'O Saúde Recife ajuda você a consultar informações e organizar seus agendamentos.'], ['2. Conta do paciente', 'Mantenha seus dados atualizados e sua senha em segurança.'], ['3. Agendamentos', 'Confirme profissional, data, horário e local antes de confirmar uma consulta.'], ['4. Orientações de IA', 'As orientações são informativas e não substituem avaliação, diagnóstico ou tratamento profissional.'], ['5. Privacidade', 'Seus dados pessoais são utilizados para oferecer os recursos do app.']];
  return <PatientFrame title="Termos de Uso" back="/perfil"><div className="mx-auto max-w-[600px] bg-[#f7faf8] p-4 sm:p-6"><section className="rounded-2xl bg-white p-5 shadow-[0_3px_12px_rgba(14,47,35,0.035)]"><p className="rounded-xl bg-[#f8faf9] p-3 text-[11px] text-[#64736d]">Texto ilustrativo — sujeito à validação jurídica.</p><div className="mt-4 rounded-xl bg-[#e5f5e9] p-3 text-[11px] leading-4 text-[#2e7a56]"><strong>Em poucas palavras</strong><br />Proteja sua conta, confirme seus agendamentos e use as orientações do app como apoio.</div>{sections.map(([title, content]) => <section key={title} className="border-b border-[#edf1ef] py-4 last:border-0"><h2 className="text-[12px] font-extrabold">{title}</h2><p className="mt-2 text-[11px] leading-5 text-[#66756f]">{content}</p></section>)}</section></div></PatientFrame>;
}
