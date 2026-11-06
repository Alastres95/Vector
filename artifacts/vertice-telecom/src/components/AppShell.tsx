import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Activity, BarChart3, BriefcaseBusiness, ChevronDown, CircleDollarSign, ClipboardList, FileText, Headset, Home, Menu, PackageCheck, Radio, Settings2, ShieldCheck, Smartphone, Users, Wifi, X } from 'lucide-react';

const groups = [
  { label: 'ESPACIO DE TRABAJO', items: [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Clientes', href: '/clientes', icon: Users },
  ]},
  { label: 'CATÁLOGO', items: [
    { label: 'Operadores', href: '/operadores', icon: Radio },
    { label: 'Tarifas', href: '/tarifas', icon: ClipboardList },
  ]},
  { label: 'COMERCIAL', items: [
    { label: 'Ventas', href: '/ventas', icon: BriefcaseBusiness },
    { label: 'Pedidos', href: '/pedidos', icon: PackageCheck },
  ]},
  { label: 'SERVICIOS', items: [
    { label: 'Líneas', href: '/lineas', icon: Smartphone },
    { label: 'Fibra', href: '/fibra', icon: Wifi },
    { label: 'Contratos', href: '/contratos', icon: FileText },
  ]},
  { label: 'OPERACIONES', items: [
    { label: 'Facturación', href: '/facturacion', icon: CircleDollarSign },
    { label: 'Incidencias', href: '/incidencias', icon: Headset },
    { label: 'Comisiones', href: '/comisiones', icon: Activity },
    { label: 'Informes', href: '/informes', icon: BarChart3 },
  ]},
  { label: 'ADMINISTRACIÓN', items: [
    { label: 'Usuarios', href: '/usuarios', icon: ShieldCheck },
    { label: 'Configuración', href: '/configuracion', icon: Settings2 },
  ]},
];
const mobileNavigation = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Ventas', href: '/ventas', icon: BriefcaseBusiness },
  { label: 'Pedidos', href: '/pedidos', icon: PackageCheck },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const currentPath = location.split('?')[0];
  const [mobileOpen, setMobileOpen] = useState(false);
  const SidebarContent = () => (
    <>
      <Link href="/" className="mb-9 flex items-center gap-3 px-3 pt-5 no-underline" data-testid="link-brand-home">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A9A5] text-white"><span className="font-display text-[22px] font-extrabold leading-none">V</span></span>
        <span className="leading-tight"><strong className="font-display block text-[15px] tracking-[.13em] text-white">VÉRTICE</strong><small className="mt-1 block text-[9px] font-semibold tracking-[.25em] text-[#9ab6c0]">TELECOM</small></span>
      </Link>
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[.06] px-3 py-3">
        <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-[#8ea9b3]">Espacio</span><ChevronDown size={14} className="text-[#8ea9b3]" /></div>
        <div className="mt-2 flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-[#49d7bf]" /><span className="text-[13px] font-semibold text-white">Vértice Telecom</span></div>
      </div>
      <nav className="space-y-6">
        {groups.map((group) => <div key={group.label}>
          <p className="mb-2 px-3 text-[9px] font-bold tracking-[.15em] text-[#75909a]">{group.label}</p>
          <div className="space-y-1">{group.items.map(({ label, href, icon: Icon }) => {
            const active = currentPath === href;
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} data-testid={`nav-${href === '/' ? 'inicio' : href.slice(1)}`} className={`sidebar-link flex items-center gap-3 rounded-lg px-3 py-[9px] text-[13px] font-medium no-underline ${active ? 'bg-[#00A9A5] text-white shadow-sm shadow-black/10' : 'text-[#a9bec5] hover:bg-white/[.07] hover:text-white'}`}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} /><span>{label}</span>{href === '/incidencias' && <span className="ml-auto rounded-full bg-[#e9a856] px-1.5 py-0.5 text-[9px] font-bold text-[#173744]">2</span>}
            </Link>;
          })}</div>
        </div>)}
      </nav>
      <div className="mt-auto pt-7">
        <div className="rounded-xl border border-white/10 bg-[#173b49] p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#e3b96c]" /> Entorno de demostración</div>
          <p className="mb-0 mt-1.5 text-[10px] leading-relaxed text-[#9ab6c0]">Los registros son ficticios y se guardan en este navegador.</p>
        </div>
        <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ccece8] text-[11px] font-bold text-[#126c6a]">MR</div>
          <div className="min-w-0"><p className="m-0 truncate text-[11px] font-semibold text-white">Marta Ruiz</p><p className="m-0 mt-0.5 text-[10px] text-[#8ea9b3]">Administradora</p></div>
        </div>
      </div>
    </>
  );
  return <div className="app-shell flex bg-[#f5f8f9]">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col overflow-y-auto bg-[#102C3A] px-4 pb-4 lg:flex"><SidebarContent /></aside>
    {mobileOpen && <div className="fixed inset-0 z-50 bg-[#102c3a]/40 lg:hidden" onClick={() => setMobileOpen(false)}><aside className="flex h-full w-[276px] flex-col overflow-y-auto bg-[#102C3A] px-4 pb-4" onClick={(e) => e.stopPropagation()}><div className="flex justify-end pt-3"><button aria-label="Cerrar menú" data-testid="button-close-menu" onClick={() => setMobileOpen(false)} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-white"><X size={20}/></button></div><SidebarContent /></aside></div>}
    <div className="min-w-0 flex-1 lg:ml-[248px]">
      <header className="sticky top-0 z-30 flex h-[66px] items-center justify-between border-b border-[#e6edef] bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
        <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#35515c] hover:bg-[#f0f5f6] lg:hidden" aria-label="Abrir menú" data-testid="button-open-menu"><Menu size={19}/></button><span className="hidden text-[12px] text-[#71838b] sm:block">Panel de gestión</span><span className="hidden h-4 w-px bg-[#dce5e8] sm:block" /><span className="text-[12px] font-semibold text-[#173744]">{groups.flatMap(g => g.items).find(i => i.href === currentPath)?.label ?? 'Vértice'}</span></div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden items-center gap-2 rounded-full border border-[#d5ecea] bg-[#f1fbfa] px-3 py-1.5 text-[10px] font-semibold text-[#147d79] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]"/>Datos de demostración</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e3f1f0] text-[11px] font-bold text-[#146e6b]">MR</div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-4 py-6 pb-28 sm:px-7 sm:py-8 sm:pb-28 lg:px-9 lg:pb-8">{children}</main>
      <footer className="px-4 pb-5 pt-2 text-center text-[10px] text-[#84939a] sm:px-7 lg:px-9">Vértice Telecom · Entorno de demostración · Sin conexiones a operadores</footer>
    </div>
    <nav aria-label="Navegación móvil" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[#e4ecee] bg-white/95 px-1 pt-1.5 shadow-[0_-8px_24px_rgba(16,44,58,.06)] backdrop-blur lg:hidden" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}>
      {mobileNavigation.map(({ label, href, icon: Icon }) => {
        const active = currentPath === href;
        return <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={active ? 'page' : undefined} data-testid={`mobile-nav-${href === '/' ? 'inicio' : href.slice(1)}`} className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[9px] font-semibold no-underline ${active ? 'text-[#008f8c]' : 'text-[#71838b]'}`}>
          <Icon size={18} strokeWidth={active ? 2.3 : 1.8}/><span>{label}</span>
        </Link>;
      })}
      <button type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir todos los módulos" data-testid="button-mobile-menu" className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[9px] font-semibold text-[#71838b]">
        <Menu size={18}/><span>Más</span>
      </button>
    </nav>
  </div>;
}
