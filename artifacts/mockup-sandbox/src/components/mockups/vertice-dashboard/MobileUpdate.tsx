import './_group.css';
import { useState, type FormEvent } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Home,
  Menu,
  Plus,
  Radio,
  Smartphone,
  Users,
  Wifi,
  X,
} from 'lucide-react';

const sales = [
  { client: 'Estudio Noroeste, S.L.', initials: 'EN', service: 'Fibra Pro 600', amount: 419, status: 'Cerrada', date: '18 feb' },
  { client: 'Clínica Alameda', initials: 'CA', service: 'Móvil Empresa 40 GB', amount: 222, status: 'Cerrada', date: '17 feb' },
  { client: 'Talleres Bruma', initials: 'TB', service: 'Fibra Simétrica 1 Gb', amount: 504, status: 'En curso', date: '17 feb' },
  { client: 'Pilar Santamaría', initials: 'PS', service: 'Convergente Oficina', amount: 683, status: 'Cerrada', date: '15 feb' },
];

const navItems = [
  { name: 'Inicio', icon: Home },
  { name: 'Clientes', icon: Users },
  { name: 'Ventas', icon: BriefcaseBusiness },
  { name: 'Servicios', icon: Wifi },
];

const euro = (amount: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

export function MobileUpdate() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Inicio');
  const [notice, setNotice] = useState('');
  const date = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const selectNav = (name: string) => {
    setActiveNav(name);
    setMenuOpen(false);
    setNotice(name === 'Inicio' ? '' : `Vista de ${name.toLowerCase()} · datos de demostración`);
  };

  const submitDemoSale = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaleOpen(false);
    setNotice('Venta de demostración registrada en esta vista.');
  };

  return (
    <div className="min-h-[100dvh] bg-[#f4f8f8] text-[#102C3A]">
      <header className="sticky top-0 z-30 border-b border-[#e2ebeb] bg-[#f8fbfb]/95 backdrop-blur">
        <div className="mx-auto flex h-[62px] max-w-[1160px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir navegación"
              data-testid="button-open-navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2ebeb] bg-white text-[#274652] transition hover:bg-[#edf6f5] lg:hidden"
            >
              <Menu size={19} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#00A9A5] text-white shadow-sm shadow-[#00A9A5]/20">
              <span className="font-display text-[21px] font-extrabold leading-none">V</span>
            </div>
            <div className="leading-none">
              <span className="font-display block text-[13px] font-extrabold tracking-[.12em] text-[#102C3A]">VÉRTICE</span>
              <span className="mt-1 block text-[8px] font-bold tracking-[.23em] text-[#71858c]">TELECOM</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-2 rounded-full border border-[#d5ecea] bg-[#eff9f8] px-3 py-2 text-[10px] font-bold text-[#167b78] sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]" />
              DEMO
            </span>
            <button
              type="button"
              onClick={() => setNotice('Sesión de demostración · Marta Ruiz')}
              aria-label="Perfil de Marta Ruiz"
              data-testid="button-profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9efed] text-[11px] font-bold text-[#116e6b] ring-2 ring-white"
            >
              MR
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1160px]">
        <aside className="hidden w-[220px] shrink-0 self-start px-4 pb-8 pt-7 lg:block">
          <p className="mb-3 px-3 text-[9px] font-bold tracking-[.16em] text-[#82959b]">ESPACIO DE TRABAJO</p>
          <nav className="space-y-1" aria-label="Navegación principal">
            {[...navItems, { name: 'Pedidos', icon: Radio }, { name: 'Contratos', icon: FileText }, { name: 'Líneas', icon: Smartphone }].map(({ name, icon: Icon }) => (
              <button
                type="button"
                key={name}
                onClick={() => selectNav(name)}
                data-testid={`nav-${name.toLowerCase()}`}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[12px] font-semibold transition ${activeNav === name ? 'bg-[#102C3A] text-white shadow-sm' : 'text-[#61777f] hover:bg-white hover:text-[#102C3A]'}`}
              >
                <Icon size={16} />
                {name}
                {activeNav === name && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#45d0c4]" />}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl border border-[#dbe9e8] bg-white p-4">
            <span className="flex items-center gap-2 text-[10px] font-bold text-[#43716e]"><Activity size={14} className="text-[#00A9A5]" /> ENTORNO DE MUESTRA</span>
            <p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#809197]">Información ficticia. Sin conexión a operadores ni sistemas reales.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-7 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d6ecea] bg-[#eff9f8] px-2.5 py-1.5 text-[9px] font-bold tracking-[.04em] text-[#167b78]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]" />
                DATOS DE DEMOSTRACIÓN
              </div>
              <h1 className="font-display m-0 max-w-[680px] text-[27px] font-extrabold leading-[1.08] tracking-[-.045em] text-[#102C3A] sm:text-[34px]">
                Bienvenido a VÉRTICE TELECOM
              </h1>
              <p className="mb-0 mt-2 text-[12px] text-[#778990]">{date}</p>
            </div>
            <button
              type="button"
              onClick={() => setSaleOpen(true)}
              data-testid="button-new-sale"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#00A9A5] px-4 text-[12px] font-bold text-white shadow-[0_5px_14px_rgba(0,169,165,.16)] transition hover:-translate-y-0.5 hover:bg-[#008f8c] sm:min-h-10"
            >
              <Plus size={17} strokeWidth={2.4} />
              Nueva venta
            </button>
          </div>

          {notice && (
            <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#cde7e4] bg-[#eaf7f5] px-4 py-3 text-[11px] font-medium text-[#286d69]">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')} aria-label="Cerrar aviso" data-testid="button-dismiss-notice" className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/70"><X size={14} /></button>
            </div>
          )}

          <section aria-label="Indicadores principales" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Clientes activos', value: '05', note: '+8,4% este mes', icon: Users, tone: 'teal' },
              { label: 'Ventas del mes', value: euro(1324), note: '+12,6% este mes', icon: CircleDollarSign, tone: 'blue' },
              { label: 'Pedidos pendientes', value: '02', note: 'Requieren seguimiento', icon: BriefcaseBusiness, tone: 'amber' },
              { label: 'Servicios activos', value: '06', note: 'Móvil y fibra', icon: Wifi, tone: 'slate' },
            ].map(({ label, value, note, icon: Icon, tone }, index) => (
              <button
                type="button"
                key={label}
                onClick={() => setNotice(`${label} · resumen ficticio del periodo`)}
                data-testid={`metric-${index}`}
                className="min-w-0 rounded-2xl border border-[#e0e9e9] bg-white p-3.5 text-left shadow-[0_2px_8px_rgba(16,44,58,.025)] transition hover:-translate-y-0.5 hover:shadow-md sm:p-4"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="max-w-[105px] text-[10px] font-semibold leading-[1.25] text-[#657980] sm:max-w-none sm:text-[11px]">{label}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${tone === 'teal' ? 'bg-[#e5f6f4] text-[#008c88]' : tone === 'blue' ? 'bg-[#e9f0f6] text-[#456c89]' : tone === 'amber' ? 'bg-[#fbf2e5] text-[#b57d31]' : 'bg-[#edf1f3] text-[#57707b]'}`}><Icon size={15} /></span>
                </div>
                <div className="font-display mt-3 truncate text-[20px] font-extrabold tracking-[-.045em] text-[#173744] sm:text-[24px]">{value}</div>
                <div className="mt-1.5 flex items-center gap-1 text-[9px] font-medium text-[#819198] sm:text-[10px]">
                  <ArrowUpRight size={12} className="shrink-0 text-[#218d78]" />
                  <span className="truncate">{note}</span>
                </div>
              </button>
            ))}
          </section>

          <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,.8fr)]">
            <div className="rounded-2xl border border-[#e0e9e9] bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display m-0 text-[14px] font-bold text-[#173744] sm:text-[16px]">Rendimiento de ventas</h2>
                  <p className="mb-0 mt-1 text-[10px] text-[#84949a]">Facturación comercial · últimos 12 meses</p>
                </div>
                <span className="shrink-0 rounded-lg border border-[#e4ebed] bg-[#fbfdfd] px-2.5 py-1.5 text-[9px] font-semibold text-[#61757e]">12 meses</span>
              </div>
              <div className="mt-4 flex items-end gap-2.5">
                <span className="font-display text-[24px] font-extrabold tracking-[-.045em] text-[#173744]">{euro(1324)}</span>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#e8f7f1] px-2 py-1 text-[9px] font-bold text-[#27856f]"><ArrowUpRight size={11} /> 12,6%</span>
              </div>
              <div className="relative mt-3 h-[122px] sm:h-[160px]">
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, transparent calc(25% - 1px), #e9eff1 25%, transparent calc(25% + 1px)), linear-gradient(to bottom, transparent calc(50% - 1px), #e9eff1 50%, transparent calc(50% + 1px)), linear-gradient(to bottom, transparent calc(75% - 1px), #e9eff1 75%, transparent calc(75% + 1px))' }} />
                <svg viewBox="0 0 572 125" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" role="img" aria-label="Evolución mensual de ventas de demostración">
                  <defs><linearGradient id="mobileChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00A9A5" stopOpacity=".2" /><stop offset="100%" stopColor="#00A9A5" stopOpacity="0" /></linearGradient></defs>
                  <polygon points="0,125 0,112 52,98 104,105 156,65 208,77 260,54 312,64 364,27 416,43 468,18 520,25 572,8 572,125" fill="url(#mobileChartFill)" />
                  <polyline points="0,112 52,98 104,105 156,65 208,77 260,54 312,64 364,27 416,43 468,18 520,25 572,8" fill="none" stroke="#00A9A5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                  <circle cx="572" cy="8" r="4" fill="#fff" stroke="#00A9A5" strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-2 flex justify-between text-[8px] font-semibold text-[#98a5aa] sm:text-[9px]">
                {['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'].map((month) => <span key={month}>{month}</span>)}
              </div>
            </div>

            <div className="rounded-2xl border border-[#e0e9e9] bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display m-0 text-[14px] font-bold text-[#173744] sm:text-[16px]">Accesos rápidos</h2>
                  <p className="mb-0 mt-1 text-[10px] text-[#84949a]">Atajos para el día a día</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf8f7] text-[#00A9A5]"><ArrowRight size={15} /></span>
              </div>
              <div className="mt-3 divide-y divide-[#edf1f2]">
                {[
                  { title: 'Nuevo cliente', subtitle: 'Registrar empresa o persona', icon: Users, action: 'Clientes' },
                  { title: 'Registrar venta', subtitle: 'Añadir oportunidad comercial', icon: BriefcaseBusiness, action: 'Nueva venta' },
                  { title: 'Revisar pedidos', subtitle: 'Consultar provisiones', icon: Radio, action: 'Pedidos' },
                ].map(({ title, subtitle, icon: Icon, action }) => (
                  <button
                    type="button"
                    key={title}
                    onClick={() => action === 'Nueva venta' ? setSaleOpen(true) : selectNav(action)}
                    data-testid={`quick-${action.toLowerCase().replaceAll(' ', '-')}`}
                    className="group flex min-h-[58px] w-full items-center gap-3 py-2 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f7f7] text-[#168b87]"><Icon size={16} /></span>
                    <span className="min-w-0 flex-1"><strong className="block text-[11px] font-bold text-[#294752]">{title}</strong><small className="mt-0.5 block truncate text-[9px] text-[#84949a]">{subtitle}</small></span>
                    <ChevronRight size={15} className="shrink-0 text-[#a3b0b4] transition group-hover:translate-x-0.5 group-hover:text-[#00A9A5]" />
                  </button>
                ))}
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-[#edf1f2] pt-3 text-[9px]">
                <span className="text-[#7f9096]">Actividad comercial</span>
                <span className="flex items-center gap-1 font-bold text-[#27856f]"><ArrowUpRight size={11} /> 8,2%</span>
              </div>
            </div>
          </section>

          <section className="mt-5 overflow-hidden rounded-2xl border border-[#e0e9e9] bg-white">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div>
                <h2 className="font-display m-0 text-[14px] font-bold text-[#173744] sm:text-[16px]">Últimas contrataciones</h2>
                <p className="mb-0 mt-1 text-[10px] text-[#84949a]">Registros ficticios · entorno de muestra</p>
              </div>
              <button type="button" onClick={() => selectNav('Contratos')} data-testid="button-all-contracts" className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg px-2 text-[10px] font-bold text-[#008f8c] hover:bg-[#eff9f8]">
                Ver todas <ArrowRight size={13} />
              </button>
            </div>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead><tr className="border-y border-[#edf1f2] bg-[#f8fafb] text-[9px] font-bold uppercase tracking-[.12em] text-[#84949a]">{['Cliente', 'Servicio', 'Fecha', 'Estado', 'Importe'].map((label) => <th key={label} className="px-5 py-3 font-semibold">{label}</th>)}</tr></thead>
                <tbody>{sales.map((sale, index) => <tr key={sale.client} className="border-b border-[#f0f3f4] last:border-0">
                  <td className="px-5 py-3"><div className="flex items-center gap-2.5"><span className={`flex h-7 w-7 items-center justify-center rounded-lg text-[9px] font-bold ${index % 2 ? 'bg-[#eff2f7] text-[#526e8a]' : 'bg-[#e6f4f1] text-[#267e71]'}`}>{sale.initials}</span><span className="text-[11px] font-semibold text-[#294752]">{sale.client}</span></div></td>
                  <td className="px-5 py-3 text-[10px] text-[#657981]">{sale.service}</td>
                  <td className="px-5 py-3 text-[10px] text-[#657981]">{sale.date}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${sale.status === 'Cerrada' ? 'bg-[#eaf7f1] text-[#26836a]' : 'bg-[#fff4e5] text-[#a9782f]'}`}>{sale.status}</span></td>
                  <td className="px-5 py-3 text-[11px] font-semibold text-[#294752]">{euro(sale.amount)}</td>
                </tr>)}</tbody>
              </table>
            </div>
            <div className="divide-y divide-[#edf1f2] px-4 sm:hidden">
              {sales.slice(0, 2).map((sale, index) => (
                <div key={sale.client} className="flex min-h-[74px] items-center gap-3 py-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold ${index % 2 ? 'bg-[#eff2f7] text-[#526e8a]' : 'bg-[#e6f4f1] text-[#267e71]'}`}>{sale.initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-bold text-[#294752]">{sale.client}</div>
                    <div className="mt-1 truncate text-[9px] text-[#84949a]">{sale.service} · {sale.date}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[11px] font-bold text-[#294752]">{euro(sale.amount)}</div>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold ${sale.status === 'Cerrada' ? 'bg-[#eaf7f1] text-[#26836a]' : 'bg-[#fff4e5] text-[#a9782f]'}`}>{sale.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <p className="mb-0 mt-5 text-center text-[9px] text-[#91a0a5]">VÉRTICE TELECOM · Entorno de demostración · Sin conexiones a operadores</p>
        </main>
      </div>

      <nav aria-label="Navegación inferior" className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e0e9e9] bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-[520px] grid-cols-4">
          {navItems.map(({ name, icon: Icon }) => (
            <button
              type="button"
              key={name}
              onClick={() => selectNav(name)}
              data-testid={`bottom-nav-${name.toLowerCase()}`}
              className={`flex min-h-[50px] flex-col items-center justify-center gap-1 rounded-xl text-[9px] font-semibold transition ${activeNav === name ? 'text-[#008f8c]' : 'text-[#819198] hover:text-[#35545d]'}`}
            >
              <Icon size={18} strokeWidth={activeNav === name ? 2.3 : 1.8} />
              {name}
            </button>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#102c3a]/35 lg:hidden" onClick={() => setMenuOpen(false)}>
          <aside role="dialog" aria-modal="true" aria-label="Menú de navegación" onClick={(event) => event.stopPropagation()} className="flex h-full w-[min(84vw,320px)] flex-col bg-[#102C3A] px-5 pb-6 pt-5 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A9A5] text-white"><span className="font-display text-[22px] font-extrabold">V</span></span>
                <span className="font-display text-[14px] font-extrabold tracking-[.1em] text-white">VÉRTICE <small className="block pt-1 text-[8px] tracking-[.22em] text-[#9ab6c0]">TELECOM</small></span>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" data-testid="button-close-navigation" className="flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10"><X size={19} /></button>
            </div>
            <span className="mb-3 px-3 text-[9px] font-bold tracking-[.15em] text-[#8ea9b3]">NAVEGACIÓN</span>
            <nav className="space-y-1">
              {[...navItems, { name: 'Pedidos', icon: Radio }, { name: 'Contratos', icon: FileText }, { name: 'Líneas', icon: Smartphone }].map(({ name, icon: Icon }) => (
                <button type="button" key={name} onClick={() => selectNav(name)} data-testid={`drawer-${name.toLowerCase()}`} className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-[13px] font-semibold ${activeNav === name ? 'bg-[#00A9A5] text-white' : 'text-[#b3c6cb] hover:bg-white/[.07] hover:text-white'}`}>
                  <Icon size={17} /> {name} {activeNav === name && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </nav>
            <div className="mt-auto rounded-xl border border-white/10 bg-white/[.06] p-4">
              <span className="text-[10px] font-bold text-[#b8d5d4]">DATOS DE DEMOSTRACIÓN</span>
              <p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#9ab6c0]">Todos los registros son ficticios. Esta vista no conecta con servicios reales.</p>
            </div>
          </aside>
        </div>
      )}

      {saleOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102c3a]/40 p-0 sm:items-center sm:p-5" onClick={() => setSaleOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="sale-dialog-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-[440px] rounded-t-[24px] border border-[#e0e9e9] bg-[#fbfdfd] p-5 shadow-2xl sm:rounded-[22px] sm:p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#eaf7f5] px-2.5 py-1 text-[9px] font-bold text-[#167b78]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]" /> SOLO DEMOSTRACIÓN</span>
                <h2 id="sale-dialog-title" className="font-display m-0 text-[20px] font-extrabold tracking-[-.03em] text-[#102C3A]">Registrar una venta</h2>
              </div>
              <button type="button" onClick={() => setSaleOpen(false)} aria-label="Cerrar formulario" data-testid="button-close-sale-dialog" className="flex h-9 w-9 items-center justify-center rounded-xl text-[#6b8188] hover:bg-[#edf4f4]"><X size={17} /></button>
            </div>
            <form onSubmit={submitDemoSale} className="space-y-4">
              <label className="block text-[11px] font-semibold text-[#3c5962]">Cliente de muestra
                <input required placeholder="p. ej., Empresa de ejemplo" data-testid="input-sale-client" className="mt-1.5 h-11 w-full rounded-xl border border-[#dce7e7] bg-white px-3 text-[12px] font-normal text-[#193b46] outline-none placeholder:text-[#a1afb3] focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/10" />
              </label>
              <label className="block text-[11px] font-semibold text-[#3c5962]">Servicio
                <input required placeholder="p. ej., Fibra Empresa 600" data-testid="input-sale-service" className="mt-1.5 h-11 w-full rounded-xl border border-[#dce7e7] bg-white px-3 text-[12px] font-normal text-[#193b46] outline-none placeholder:text-[#a1afb3] focus:border-[#00A9A5] focus:ring-2 focus:ring-[#00A9A5]/10" />
              </label>
              <p className="m-0 rounded-xl bg-[#f0f6f6] px-3 py-2.5 text-[10px] leading-relaxed text-[#788d93]">Este formulario es interactivo solo como demostración. No guarda datos ni envía información.</p>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setSaleOpen(false)} data-testid="button-cancel-sale" className="min-h-11 flex-1 rounded-xl border border-[#dce7e7] bg-white text-[11px] font-bold text-[#5e757d] hover:bg-[#f5f8f8]">Cancelar</button>
                <button type="submit" data-testid="button-submit-demo-sale" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#00A9A5] text-[11px] font-bold text-white hover:bg-[#008f8c]"><Plus size={15} /> Vista previa</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
