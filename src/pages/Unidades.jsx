import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Building2, ChevronRight, MapPin, Phone, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PatientBottomNav from '../components/PatientBottomNav';
import { getClinicas, getMedicos } from '../services/api';

export default function Unidades() {
  const [term, setTerm] = useState('');
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getClinicas(), getMedicos()])
      .then(([clinics, professionals]) => {
        const specialtiesByClinic = professionals.reduce((result, professional) => {
          const clinicId = professional.clinicaId?._id;
          if (!clinicId || !professional.especialidade) return result;
          const specialties = result.get(clinicId) || new Set();
          specialties.add(professional.especialidade);
          result.set(clinicId, specialties);
          return result;
        }, new Map());

        setUnits(clinics.map((clinic) => ({
          ...clinic,
          specialties: [...(specialtiesByClinic.get(clinic._id) || [])],
        })));
      })
      .catch(() => setError('Não foi possível carregar as unidades agora.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredUnits = useMemo(() => {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) return units;
    return units.filter((unit) => [unit.nome, unit.bairro, unit.cidade, unit.endereco]
      .some((value) => value?.toLowerCase().includes(normalizedTerm)));
  }, [term, units]);

  return (
    <div className="patient-page min-h-screen bg-[#f7faf8] px-3 py-4 pb-28 sm:px-6 sm:py-7">
      <main className="mx-auto w-full max-w-[960px] overflow-hidden rounded-[24px] border border-[#edf1ef] bg-white shadow-[0_14px_35px_rgba(14,47,35,0.08)]">
        <header className="flex min-h-[66px] items-center border-b border-[#eef1f0] px-4 sm:px-6">
          <Link aria-label="Voltar" to="/buscar-atendimento" className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg text-[#13251f] transition hover:bg-[#edf8f2]">
            <ArrowLeft size={19} />
          </Link>
          <h1 className="flex-1 text-[15px] font-extrabold tracking-[-0.02em] text-[#15251f] sm:text-base">Unidades de saúde</h1>
        </header>

        <div className="bg-[#f7faf8] p-4 sm:p-6">
          <div className="mx-auto max-w-[760px]">
            <section className="rounded-2xl bg-white p-4 shadow-[0_3px_12px_rgba(14,47,35,0.035)]">
              <p className="text-[11px] leading-4 text-[#718079]">Encontre clínicas e conheça as especialidades disponíveis em cada unidade.</p>
              <label className="relative mt-4 block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#83918c]" size={18} />
                <input
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Buscar unidade ou bairro..."
                  className="min-h-[48px] w-full rounded-xl border border-[#e1e8e4] bg-[#fbfdfc] py-3 pl-11 pr-4 text-[13px] outline-none focus:border-[#0ba561] focus:ring-2 focus:ring-[#0ba561]/15"
                />
              </label>
            </section>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {loading && <p className="col-span-full rounded-2xl border border-dashed border-[#cfe0d7] py-10 text-center text-[12px] text-[#66756f]">Carregando unidades...</p>}
              {error && <p role="alert" className="col-span-full rounded-2xl border border-[#fecaca] bg-[#fff5f5] p-4 text-center text-[12px] font-semibold text-[#c22920]">{error}</p>}
              {!loading && !error && filteredUnits.map((unit) => (
                <article key={unit._id} className="rounded-2xl border border-[#e7ece9] bg-white p-4 shadow-[0_3px_10px_rgba(14,47,35,0.035)]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f6ec] text-[#078653]"><Building2 size={20} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#078653]">Unidade</p>
                      <h2 className="mt-1 text-[14px] font-extrabold leading-5 text-[#162820]">{unit.nome}</h2>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-[11px] leading-4 text-[#60706a]">
                    <p className="flex gap-2"><MapPin className="mt-0.5 shrink-0 text-[#078653]" size={15} /><span>{[unit.endereco, unit.bairro, unit.cidade].filter(Boolean).join(' — ') || 'Endereço não informado'}</span></p>
                    {unit.telefone && <p className="flex items-center gap-2"><Phone className="shrink-0 text-[#078653]" size={15} />{unit.telefone}</p>}
                  </div>
                  {unit.specialties.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{unit.specialties.map((specialty) => <span key={specialty} className="rounded-full bg-[#edf8f2] px-2.5 py-1 text-[10px] font-bold text-[#087749]">{specialty}</span>)}</div>}
                  <Link to={`/buscar-atendimento?busca=${encodeURIComponent(unit.nome)}`} className="mt-4 flex items-center justify-between border-t border-[#edf1ef] pt-3 text-[11px] font-bold text-[#078653]">Ver profissionais <ChevronRight size={16} /></Link>
                </article>
              ))}
              {!loading && !error && filteredUnits.length === 0 && <p className="col-span-full rounded-2xl border border-dashed border-[#cfe0d7] py-10 text-center text-[12px] text-[#66756f]">Nenhuma unidade encontrada.</p>}
            </div>
          </div>
        </div>
      </main>
      <PatientBottomNav />
    </div>
  );
}
