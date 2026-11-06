import './_group.css';
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CircleDollarSign, Plus, Radio, Users, Wifi } from 'lucide-react';
import type { AnchorHTMLAttributes } from 'react';

const previewData = {
  clientes: Array.from({ length: 5 }, () => ({ estado: 'Activo' })),
  ventas: [
    { cliente: 'Estudio Noroeste, S.L.', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', importe: 419, estado: 'Cerrada', fecha: '18/02/2025' },
    { cliente: 'Clínica Alameda', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', importe: 222, estado: 'Cerrada', fecha: '17/02/2025' },
    { cliente: 'Talleres Bruma', servicio: 'Fibra Simétrica 1 Gb', operador: 'Orange Empresas', importe: 504, estado: 'En curso', fecha: '17/02/2025' },
    { cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', importe: 683, estado: 'Cerrada', fecha: '15/02/2025' },
  ],
  pedidos: [{ estado: 'En curso' }, { estado: 'Pendiente' }, { estado: 'Completado' }, { estado: 'Completado' }],
  lineas: Array.from({ length: 4 }, () => ({ estado: 'Activa' })),
  fibra: [{ estado: 'Activa' }, { estado: 'Activa' }, { estado: 'En instalación' }, { estado: 'Activa' }],
};

function PreviewLink({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={href} {...props}>{children}</a>;
}

const chartPoints = '0,112 52,98 104,105 156,65 208,77 260,54 312,64 364,27 416,43 468,18 520,25 572,8';
const euro = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export function Current() {
  const revenue = previewData.ventas.filter(v => v.estado === 'Cerrada').reduce((sum, v) => sum + v.importe, 0);
  const metrics = [
    { label: 'Clientes activos', value: '5', note: '+8,4% vs. mes anterior', icon: Users, color: 'teal', href: '/clientes' },
    { label: 'Ventas del mes', value: euro(revenue), note: '+12,6% vs. mes anterior', icon: CircleDollarSign, color: 'blue', href: '/ventas' },
    { label: 'Pedidos pendientes', value: '02', note: '2 requieren seguimiento', icon: BriefcaseBusiness, color: 'amber', href: '/pedidos' },
    { label: 'Servicios activos', value: '6', note: 'Líneas móviles y fibra', icon: Wifi, color: 'slate', href: '/lineas' },
  ];
  const quickLinks = [
    { name: 'Nuevo cliente', href: '/clientes', icon: Users, hint: 'Registrar empresa o persona' },
    { name: 'Registrar venta', href: '/ventas', icon: BriefcaseBusiness, hint: 'Añadir oportunidad comercial' },
    { name: 'Ver pedidos', href: '/pedidos', icon: Radio, hint: 'Revisar provisiones' },
  ];

  return <div className="page-enter min-h-screen space-y-7 p-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#d6ecea] bg-[#eff9f8] px-2.5 py-1 text-[10px] font-semibold text-[#167b78]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]"/> Datos de demostración</div>
        <h1 className="font-display m-0 text-[28px] font-bold tracking-[-.04em] text-[#102C3A] sm:text-[34px]">Buenos días, Marta</h1>
        <p className="mb-0 mt-1.5 text-[13px] text-[#71828a]">Resumen de actividad del periodo de demostración de febrero de 2025.</p>
      </div>
      <PreviewLink href="/ventas" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[12px] font-semibold text-white no-underline shadow-sm hover:bg-[#008f8c]"><Plus size={16}/> Nueva venta</PreviewLink>
    </div>

    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores principales">
      {metrics.map(({label,value,note,icon:Icon,color,href}) => <PreviewLink href={href} key={label} className="group rounded-xl border border-[#e3eaec] bg-white p-4 no-underline transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
        <div className="flex items-center justify-between"><span className="text-[12px] font-medium text-[#63767e]">{label}</span><span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color==='teal'?'bg-[#e5f6f4] text-[#008c88]':color==='blue'?'bg-[#e9f0f6] text-[#456c89]':color==='amber'?'bg-[#fbf2e5] text-[#b57d31]':'bg-[#edf1f3] text-[#57707b]'}`}><Icon size={16}/></span></div>
        <div className="mt-4 flex items-end justify-between"><span className="font-display text-[26px] font-bold tracking-[-.04em] text-[#173744]">{value}</span><ArrowUpRight size={15} className="mb-1 text-[#00A9A5] opacity-0 transition group-hover:opacity-100"/></div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#829198]"><ArrowUpRight size={12} className="text-[#1b9a83]"/>{note}</div>
      </PreviewLink>)}
    </section>

    <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,.85fr)]">
      <div className="rounded-xl border border-[#e3eaec] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Rendimiento de ventas</h2><p className="mb-0 mt-1 text-[11px] text-[#809097]">Facturación comercial · últimos 12 meses</p></div><span className="rounded-md border border-[#e4ebed] px-2.5 py-1.5 text-[10px] font-semibold text-[#61757e]">12 meses</span></div>
        <div className="mt-6 flex items-end gap-3"><span className="font-display text-[27px] font-bold tracking-[-.04em] text-[#173744]">{euro(revenue)}</span><span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#e8f7f1] px-2 py-1 text-[10px] font-semibold text-[#27856f]"><ArrowUpRight size={12}/> 12,6%</span></div>
        <div className="relative mt-5 h-[170px]"><div className="chart-grid absolute inset-0"/><svg viewBox="0 0 572 125" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-label="Gráfico de ventas"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#00A9A5" stopOpacity=".19"/><stop offset="100%" stopColor="#00A9A5" stopOpacity="0"/></linearGradient></defs><polygon points={`0,125 ${chartPoints} 572,125`} fill="url(#chartFill)"/><polyline points={chartPoints} fill="none" stroke="#00A9A5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"/><circle cx="572" cy="8" r="4" fill="#fff" stroke="#00A9A5" strokeWidth="2"/></svg></div>
        <div className="mt-2 flex justify-between text-[9px] font-medium text-[#99a6ab]">{['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'].map(m=><span key={m}>{m}</span>)}</div>
      </div>
      <div className="rounded-xl border border-[#e3eaec] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between"><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Accesos rápidos</h2><p className="mb-0 mt-1 text-[11px] text-[#809097]">Atajos para el trabajo diario</p></div><span className="rounded-lg bg-[#f0f7f7] p-2 text-[#00A9A5]"><ArrowRight size={16}/></span></div>
        <div className="mt-4 divide-y divide-[#edf1f2]">{quickLinks.map(({name,href,icon:Icon,hint})=><PreviewLink href={href} key={name} className="group flex items-center gap-3 py-3.5 no-underline"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0f7f7] text-[#168b87]"><Icon size={17}/></span><span className="min-w-0 flex-1"><strong className="block text-[12px] font-semibold text-[#294752]">{name}</strong><small className="mt-0.5 block text-[10px] text-[#84949a]">{hint}</small></span><ArrowRight size={15} className="text-[#a3b0b4] transition group-hover:translate-x-1 group-hover:text-[#00A9A5]"/></PreviewLink>)}</div>
        <div className="mt-3 flex items-center justify-between border-t border-[#edf1f2] pt-4"><span className="text-[10px] text-[#7f9096]">Actividad comercial equilibrada</span><span className="flex items-center gap-1 text-[10px] font-semibold text-[#27856f]"><ArrowUpRight size={12}/> 8,2%</span></div>
      </div>
    </section>

    <section className="overflow-hidden rounded-xl border border-[#e3eaec] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6"><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Últimas contrataciones</h2><p className="mb-0 mt-1 text-[11px] text-[#809097]">Movimientos recientes en el entorno de muestra</p></div><PreviewLink href="/contratos" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008f8c] no-underline">Ver contratos <ArrowRight size={13}/></PreviewLink></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[650px] border-collapse text-left"><thead><tr className="border-y border-[#edf1f2] bg-[#f8fafb] text-[9px] font-bold uppercase tracking-[.12em] text-[#84949a]">{['Cliente','Servicio','Operador','Fecha','Estado','Importe'].map(x=><th key={x} className="px-5 py-3 font-semibold">{x}</th>)}</tr></thead><tbody>{previewData.ventas.map((sale,i)=><tr key={i} className="border-b border-[#f0f3f4] last:border-0"><td className="px-5 py-3.5 text-[11px] font-semibold text-[#294752]">{sale.cliente}</td><td className="px-5 py-3.5 text-[11px] text-[#657981]">{sale.servicio}</td><td className="px-5 py-3.5 text-[11px] text-[#657981]">{sale.operador}</td><td className="px-5 py-3.5 text-[11px] text-[#657981]">{sale.fecha}</td><td className="px-5 py-3.5 text-[11px]">{sale.estado}</td><td className="px-5 py-3.5 text-[11px] font-semibold text-[#294752]">{euro(sale.importe)}</td></tr>)}</tbody></table></div>
    </section>
  </div>;
}
