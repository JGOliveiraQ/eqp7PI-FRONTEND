import { Bot, House, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/', label: 'Início', icon: House, matches: ['/'] },
  { to: '/assistente-ia', label: 'IA', icon: Bot, matches: ['/assistente-ia', '/resultado-analise'] },
  { to: '/perfil', label: 'Perfil', icon: UserRound, matches: ['/perfil', '/editar-perfil', '/meus-agendamentos', '/detalhes-consulta', '/reagendar-consulta'] },
];

export default function PatientBottomNav() {
  const { pathname } = useLocation();
  return <nav aria-label="Navegação principal" className="fixed bottom-4 left-1/2 z-30 flex w-[min(360px,calc(100%-2rem))] -translate-x-1/2 items-center justify-around rounded-2xl border border-[#e3ece6] bg-white/95 px-2 py-2 shadow-[0_12px_28px_rgba(15,50,37,.18)] backdrop-blur sm:bottom-6">
    {items.map(({ to, label, icon: Icon, matches }) => {
      const active = matches.includes(pathname);
      return <Link key={to} to={to} className={`flex min-w-[78px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-bold transition ${active ? 'bg-[#e6f4ea] text-[#0f8b5f]' : 'text-[#6b7280] hover:bg-[#f4faf7] hover:text-[#0f8b5f]'}`}><Icon size={18} strokeWidth={active ? 2.6 : 2} />{label}</Link>;
    })}
  </nav>;
}
