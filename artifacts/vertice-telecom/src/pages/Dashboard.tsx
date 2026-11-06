import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Plus, Radio, Users, Wifi } from 'lucide-react';
import { Link } from 'wouter';
import { useDemoData } from '../data/DemoProvider';

const chartPoints = '0,112 52,98 104,105 156,65 208,77 260,54 312,64 364,27 416,43 468,18 520,25 572,8';
const chartMonths = ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'];
const euro = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function Dashboard() {
  const { list } = useDemoData();
  const clients = list('clientes');
  const sales = list('ventas');
  const orders = list('pedidos');
  const lines = list('lineas');
  const revenue = sales.filter(v => v.estado === 'Cerrada').reduce((sum, v) => sum + v.importe, 0);
  const metrics = [
    { label: 'Clientes activos', value: clients.filter(c => c.estado === 'Activo').length.toLocaleString('es-ES'), note: '+8,4% vs. mes anterior', icon: Users, color: 'teal', href: '/clientes' },
    { label: 'Ventas del mes', value: euro(revenue), note: '+12,6% vs. mes anterior', icon: CircleDollarSign, color: 'blue', href: '/ventas' },
    { label: 'Pedidos pendientes', value: String(orders.filter(o => o.estado !== 'Completado').length).padStart(2, '0'), note: '2 requieren seguimiento', icon: BriefcaseBusiness, color: 'amber', href: '/pedidos' },
    { label: 'Servicios activos', value: String(lines.filter(l => l.estado === 'Activa').length + list('fibra').filter(f => f.estado === 'Activa').length), note: 'Líneas móviles y fibra', icon: Wifi, color: 'slate', href: '/lineas' },
  ];
  const quickLinks = [
    { name: 'Nuevo cliente', href: '/clientes', icon: Users, hint: 'Registrar empresa o persona' },
    { name: 'Registrar venta', href: '/ventas', icon: BriefcaseBusiness, hint: 'Añadir oportunidad comercial' },
    { name: 'Ver pedidos', href: '/pedidos', icon: Radio, hint: 'Revisar provisiones' },
  ];
  return <div className="page-enter space-y-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d6ecea] bg-[#eff9f8] px-2.5 py-1 text-[10px] font-semibold text-[#167b78]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]"/> Datos de demostración</div><h1 className="font-display m-0 text-[28px] font-bold tracking-[-.04em] text-[#102C3A] sm:text-[34px]">Buenos días, Marta</h1><p className="mb-0 mt-1.5 text-[13px] text-[#71828a]">Resumen de actividad del periodo de demostración de febrero de 2025.</p></div>
      <Link href="/ventas" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[12px] font-semibold text-white no-underline shadow-sm hover:bg-[#008f8c]" data-testid="button-new-sale"><Plus size={16}/> Nueva venta</Link>
    </div>
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
      {metrics.map(({label,value,note,icon:Icon,color,href}, index) => <Link href={href} key={label} data-testid={`metric-${index}`} className="group rounded-xl border border-[#e3eaec] bg-white p-4 no-underline transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#173744]/[.05] sm:p-5">
        <div className="flex items-center justify-between"><span className="text-[12px] font-medium text-[#63767e]">{label}</span><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color==='teal'?'bg-[#e5f6f4] text-[#008c88]':color==='blue'?'bg-[#e9f0f6] text-[#456c89]':color==='amber'?'bg-[#fbf2e5] text-[#b57d31]':'bg-[#edf1f3] text-[#57707b]'}`}><Icon size={16}/></span></div>
        <div className="mt-4 flex items-end justify-between"><span className="font-display text-[26px] font-bold tracking-[-.04em] text-[#173744]" data-testid={`value-${index}`}>{value}</span><ArrowUpRight size={15} className="mb-1 text-[#00A9A5] opacity-0 transition group-hover:opacity-100"/></div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#829198]"><ArrowUpRight size={12} className="text-[#1b9a83]"/>{note}</div>
      </Link>)}
    </section>
    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.85fr)]">
      <div className="rounded-xl border border-[#e3eaec] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Rendimiento de ventas</h2><p className="mb-0 mt-1 text-[11px] text-[#809097]">Facturación comercial · últimos 12 meses</p></div><span className="rounded-md border border-[#e4ebed] px-2.5 py-1.5 text-[10px] font-semibold text-[#61757e]" data-testid="label-chart-period">12 meses</span></div>
        <div className="mt-6 flex items-end gap-3"><span className="font-display text-[27px] font-bold tracking-[-.04em] text-[#173744]" data-testid="dashboard-sales-total">{euro(revenue)}</span><span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#e8f7f1] px-2 py-1 text-[10px] font-semibold text-[#27856f]"><ArrowUpRight size={12}/> 12,6%</span></div>
        <div className="relative mt-5 h-[170px]"><div className="chart-grid absolute inset-0"/><svg viewBox="0 0 572 125" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-label="Gráfico de ventas"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00A9A5" stopOpacity=".19"/><stop offset="100%" stopColor="#00A9A5" stopOpacity="0"/></linearGradient></defs><polygon points={`0,125 ${chartPoints} 572,125`} fill="url(#chartFill)"/><polyline points={chartPoints} fill="none" stroke="#00A9A5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"/><circle cx="572" cy="8" r="4" fill="#fff" stroke="#00A9A5" strokeWidth="2"/></svg></div>
        <div className="mt-2 flex justify-between text-[9px] font-medium text-[#99a6ab]">{chartMonths.map(m=><span key={m}>{m}</span>)}</div>
      </div>
      <div className="rounded-xl border border-[#e3eaec] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between"><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Accesos rápidos</h2><p className="mb-0 mt-1 text-[11px] text-[#809097]">Atajos para el trabajo diario</p></div><span className="rounded-lg bg-[#f0f7f7] p-2 text-[#00A9A5]"><ArrowRight size={16}/></span></div>
        <div className="mt-4 divide-y divide-[#edf1f2]">{quickLinks.map(({name,href,icon:Icon,hint})=><Link href={href} key={name} data-testid={`quick-${href.slice(1)}`} className="group flex items-center gap-3 py-3.5 no-underline"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f7f7] text-[#168b87]"><Icon size={17}/></span><span className="min-w-0 flex-1"><strong className="block text-[12px] font-semibold text-[#294752]">{name}</strong><small className="mt-0.5 block text-[10px] text-[#84949a]">{hint}</small></span><ArrowRight size={15} className="text-[#a3b0b4] transition group-hover:translate-x-1 group-hover:text-[#00A9A5]"/></Link>)}</div>
        <div className="mt-3 flex items-center justify-between border-t border-[#edf1f2] pt-4"><span className="text-[10px] text-[#7f9096]">Actividad comercial equilibrada</span><span className="flex items-center gap-1 text-[10px] font-semibold text-[#27856f]"><ArrowUpRight size={12}/> 8,2%</span></div>
      </div>
    </section>
    <section className="overflow-hidden rounded-xl border border-[#e3eaec] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Últimas contrataciones</h2><p className="mb-0 mt-1 text-[11px] text-[#809097]">Movimientos recientes en el entorno de muestra</p></div><Link href="/contratos" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008f8c] no-underline hover:text-[#006f6d]" data-testid="link-all-contracts">Ver contratos <ArrowRight size={13}/></Link></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left"><thead><tr className="border-y border-[#edf1f2] bg-[#f8fafb] text-[9px] font-bold uppercase tracking-[.12em] text-[#84949a]">{['Cliente','Servicio','Operador','Fecha','Estado','Importe'].map(x=><th key={x} className="px-5 py-3 font-semibold">{x}</th>)}</tr></thead><tbody>{sales.slice(0,4).map((sale,i)=><tr key={sale.id} data-testid={`row-contract-${sale.id}`} className="border-b border-[#f0f3f4] last:border-0"><td className="px-5 py-3.5"><div className="flex items-center gap-2.5"><span className={`flex h-7 w-7 items-center justify-center rounded-md text-[9px] font-bold ${i%2?'bg-[#eff2f7] text-[#526e8a]':'bg-[#e6f4f1] text-[#267e71]'}`}>{sale.cliente.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><span className="text-[11px] font-semibold text-[#294752]">{sale.cliente}</span></div></td><td className="px-5 py-3.5 text-[11px] text-[#657981]">{sale.servicio}</td><td className="px-5 py-3.5 text-[11px] text-[#657981]">{sale.operador}</td><td className="px-5 py-3.5 text-[11px] text-[#657981]">{sale.fecha}</td><td className="px-5 py-3.5"><span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${sale.estado==='Cerrada'?'bg-[#eaf7f1] text-[#26836a]':'bg-[#fff4e5] text-[#a9782f]'}`}>{sale.estado}</span></td><td className="px-5 py-3.5 text-[11px] font-semibold text-[#294752]">{euro(sale.importe)}</td></tr>)}</tbody></table></div>
      {sales.length===0 && <div className="px-6 py-10 text-center text-[12px] text-[#819198]">Aún no hay contrataciones en esta demostración.</div>}
    </section>
  </div>;
}
