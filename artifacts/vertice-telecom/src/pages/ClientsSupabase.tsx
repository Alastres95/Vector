import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { Archive, ArrowLeft, ArrowRight, Building2, CircleAlert, Filter, Mail, MapPin, Phone, Plus, Search, UserRound, Users } from 'lucide-react';
import { ClientFormDialog } from '../components/clients/ClientFormDialog';
import { SupabaseSignIn } from '../components/clients/SupabaseSignIn';
import { type Cliente } from '../data/demo-data';
import { useClientes } from '../hooks/use-clientes';
import { useSupabaseSession } from '../hooks/use-supabase-session';
import { supabase, supabaseConfigured } from '../lib/supabase';

type DialogState = Cliente | 'new' | null;

const stateTone = (state: string) => state === 'Activo'
  ? 'bg-[#eaf7f1] text-[#27836a]'
  : state === 'Pendiente'
    ? 'bg-[#fff4e5] text-[#a9782f]'
    : 'bg-[#fbeceb] text-[#b45953]';

const normal = (value: string) => value.toLocaleLowerCase('es').trim();

function DataError({ message }: { message: string }) {
  return <div className="rounded-xl border border-[#f0d8d5] bg-[#fff6f5] px-4 py-3 text-[11px] leading-relaxed text-[#a44e48]" role="alert">
    <strong className="block">No se pudieron cargar los clientes reales.</strong>
    <span className="mt-1 block">Comprueba las columnas de <code>public.clientes</code>, las políticas RLS y el rol de la cuenta. No se sustituyeron por datos de demostración.</span>
    <span className="mt-1 block text-[10px]">{message}</span>
  </div>;
}

export function SupabaseClientsPage({ onViewDemo }: { onViewDemo: () => void }) {
  const { user, loading: authLoading } = useSupabaseSession();
  const [location] = useLocation();
  const { records, loading, error, setError, canManage, save, archive } = useClientes('real', user);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('Todos');
  const [dialog, setDialog] = useState<DialogState>(null);
  const [notice, setNotice] = useState('');
  const newHandled = useRef(false);

  useEffect(() => {
    if (user && canManage && new URLSearchParams(window.location.search).get('nuevo') === '1' && !newHandled.current) {
      newHandled.current = true;
      setDialog('new');
    }
  }, [location, user, canManage]);

  const visible = useMemo(() => {
    const query = normal(search);
    return records.filter(client => {
      const match = !query || [client.nombre, client.identificadorFiscal, client.telefono, client.email].some(value => normal(value).includes(query));
      return match && (stateFilter === 'Todos' || client.estado === stateFilter);
    });
  }, [records, search, stateFilter]);

  const saveClient = async (input: Parameters<typeof save>[0]) => {
    await save(input, dialog !== 'new' && dialog ? dialog : undefined);
    setNotice('Cliente guardado en Supabase.');
    window.setTimeout(() => setNotice(''), 2800);
  };

  const archiveClient = async (client: Cliente) => {
    if (!window.confirm(`¿Archivar a ${client.nombre}? Se marcará como Inactivo; no se borrará de la base de datos.`)) return;
    try {
      await archive(client);
      setNotice('Cliente archivado como Inactivo.');
      window.setTimeout(() => setNotice(''), 2800);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo archivar el cliente.');
    }
  };

  if (!supabaseConfigured || !supabase) return <div className="page-enter rounded-xl border border-[#e6e9dd] bg-[#fcfbf5] p-5 text-[12px] leading-relaxed text-[#786b4e]">Supabase no está configurado. Abre la pestaña de demostración para trabajar con los seis registros ficticios.</div>;
  if (authLoading) return <div className="rounded-xl border border-[#e3eaec] bg-white p-6 text-[12px] text-[#71838a]" role="status">Comprobando sesión segura…</div>;
  if (!user) return <SupabaseSignIn onViewDemo={onViewDemo}/>;

  const canWrite = canManage;
  return <div className="page-enter space-y-5">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#138c88]">Espacio de trabajo / Clientes reales</div>
        <h1 className="font-display m-0 text-[30px] font-bold tracking-[-.04em] text-[#102C3A] sm:text-[34px]">Clientes</h1>
        <p className="mb-0 mt-1.5 text-[12px] text-[#71838a]">Registros accesibles según la sesión y las políticas RLS de Supabase.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d5ecea] bg-[#f1fbfa] px-3 text-[10px] font-semibold text-[#147d79]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]"/> Supabase · autenticado</span>
        <button type="button" onClick={() => { void supabase?.auth.signOut(); }} className="min-h-11 rounded-lg border border-[#dfe7e9] px-3 text-[10px] font-semibold text-[#526a73] hover:bg-white">Cerrar sesión</button>
        {canWrite && <button type="button" onClick={() => setDialog('new')} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[11px] font-semibold text-white hover:bg-[#008f8c]" data-testid="button-create-real-client"><Plus size={15}/> Añadir cliente</button>}
      </div>
    </div>

    {!user.app_metadata.organization_id && <div className="flex items-start gap-2.5 rounded-lg border border-[#e7e4d5] bg-[#fcfbf6] px-4 py-3 text-[10px] leading-relaxed text-[#786e59]"><CircleAlert size={15} className="mt-0.5 shrink-0"/><span>Esta cuenta no tiene `organization_id` en app_metadata. RLS limita su acceso a su espacio privado. Para compartir con el equipo, una persona administradora debe asignar el UUID de la organización en app_metadata.</span></div>}
    {notice && <div className="rounded-lg border border-[#cce9e6] bg-[#eff9f8] px-4 py-3 text-[11px] text-[#167b78]" role="status">{notice}</div>}
    {error && <DataError message={error}/>}

    <section className="overflow-hidden rounded-xl border border-[#e3eaec] bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf1f2] p-4 sm:flex-row sm:items-center sm:px-5">
        <div className="relative w-full sm:max-w-[380px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a0a5]"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar nombre, NIF/CIF, teléfono o correo…" aria-label="Buscar clientes reales" className="min-h-11 w-full rounded-lg border border-[#e3eaec] bg-[#fbfcfc] pl-9 pr-3 text-[11px] outline-none focus:border-[#69c8c3]"/></div>
        <div className="flex items-center gap-2"><Filter size={14} className="text-[#84949a]"/><select value={stateFilter} onChange={event => setStateFilter(event.target.value)} aria-label="Filtrar clientes reales por estado" className="min-h-11 min-w-[140px] rounded-lg border border-[#e3eaec] bg-white px-3 text-[11px] text-[#526a73]"><option>Todos</option><option>Activo</option><option>Pendiente</option><option>Inactivo</option></select><span className="rounded-md bg-[#f2f6f7] px-2.5 py-2 text-[10px] text-[#71838a]">{visible.length} clientes</span></div>
      </div>
      {loading ? <div className="p-10 text-center text-[12px] text-[#71838a]" role="status">Cargando clientes autorizados…</div> :
        !error && visible.length ? <>
          <div className="space-y-3 p-3 md:hidden">
            {visible.map(client => <article key={client.id} className="rounded-xl border border-[#e3eaec] p-4">
              <div className="flex items-start justify-between gap-3"><Link href={`/clientes/${encodeURIComponent(client.id)}?origen=real`} className="min-w-0 text-inherit no-underline"><span className="text-[9px] uppercase tracking-[.1em] text-[#82939a]">{client.tipo}</span><h2 className="m-0 mt-1 break-words text-[13px] font-bold text-[#173744]">{client.nombre}</h2><span className="mt-1 block text-[10px] text-[#71838a]">{client.identificadorFiscal}</span></Link><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${stateTone(client.estado)}`}>{client.estado}</span></div>
              <div className="mt-3 grid gap-2 border-t border-[#edf1f2] pt-3 text-[10px] text-[#60747c]"><span className="flex items-center gap-2"><Phone size={13}/>{client.telefono}</span><span className="flex items-center gap-2 break-all"><Mail size={13}/>{client.email}</span><span className="flex items-center gap-2"><Users size={13}/>{client.comercial}</span></div>
              <div className="mt-3 flex justify-between border-t border-[#edf1f2] pt-3"><Link href={`/clientes/${encodeURIComponent(client.id)}?origen=real`} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold text-[#147d79] no-underline">Ver ficha <ArrowRight size={13}/></Link>{canWrite && <><button type="button" onClick={() => setDialog(client)} className="min-h-11 rounded-lg border border-[#e2e9eb] px-3 text-[10px] font-semibold text-[#526a73]">Editar</button><button type="button" onClick={() => void archiveClient(client)} className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-[#f0dddc] px-3 text-[10px] font-semibold text-[#a96c67]"><Archive size={13}/>Archivar</button></>}</div>
            </article>)}
          </div>
          <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[850px] border-collapse text-left">
            <thead><tr className="border-b border-[#edf1f2] bg-[#f8fafb] text-[9px] font-bold uppercase tracking-[.12em] text-[#84949a]"><th className="px-5 py-3">Cliente</th><th className="px-4 py-3">NIF/CIF</th><th className="px-4 py-3">Contacto</th><th className="px-4 py-3">Comercial</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead>
            <tbody>{visible.map(client => <tr key={client.id} className="border-b border-[#f0f3f4] last:border-0 hover:bg-[#fbfdfd]"><td className="px-5 py-3.5"><Link href={`/clientes/${encodeURIComponent(client.id)}?origen=real`} className="font-semibold text-[#294752] no-underline hover:text-[#008f8c]">{client.nombre}</Link><span className="mt-1 block text-[9px] text-[#8a999f]">{client.tipo}</span></td><td className="px-4 py-3.5 text-[10px] text-[#657981]">{client.identificadorFiscal}</td><td className="px-4 py-3.5 text-[10px] text-[#657981]">{client.contacto || '—'}<span className="mt-1 block text-[#8a999f]">{client.email}</span></td><td className="px-4 py-3.5 text-[10px] text-[#657981]">{client.comercial}</td><td className="px-4 py-3.5"><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${stateTone(client.estado)}`}>{client.estado}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><Link href={`/clientes/${encodeURIComponent(client.id)}?origen=real`} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#168b87] no-underline hover:bg-[#e9f6f4]"><ArrowRight size={15}/></Link>{canWrite && <><button type="button" onClick={() => setDialog(client)} className="min-h-10 rounded-lg px-2 text-[10px] text-[#56717b] hover:bg-[#edf3f4]">Editar</button><button type="button" onClick={() => void archiveClient(client)} aria-label={`Archivar ${client.nombre}`} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#a96c67] hover:bg-[#fbefee]"><Archive size={14}/></button></>}</div></td></tr>)}</tbody>
          </table></div>
        </> : !error ? <div className="px-6 py-14 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#eef7f6] text-[#198d88]"><Users size={19}/></span><h2 className="font-display mb-0 mt-4 text-[14px] font-bold text-[#294752]">{records.length ? 'No hay resultados' : 'Todavía no hay clientes reales'}</h2><p className="mb-0 mt-1.5 text-[11px] text-[#829198]">{records.length ? 'Prueba con otro término o cambia el filtro.' : 'Los seis registros de demostración no se copian a Supabase.'}</p></div> : null}
      <div className="flex items-center justify-between border-t border-[#edf1f2] bg-[#fcfdfd] px-4 py-3 text-[9px] text-[#98a5aa]"><span>Datos protegidos por RLS</span><span>{visible.length} de {records.length}</span></div>
    </section>
    {!canManage && <p className="m-0 text-[10px] text-[#819198]">Tu rol tiene acceso de consulta; solo los perfiles autorizados pueden crear o modificar clientes.</p>}
    {dialog && <ClientFormDialog client={dialog === 'new' ? undefined : dialog} dataMode="real" onClose={() => setDialog(null)} onSave={saveClient}/>}
  </div>;
}

export function SupabaseClientDetailPage({ onViewDemo }: { onViewDemo: () => void }) {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useSupabaseSession();
  const { records, loading, error, canManage, save, archive } = useClientes('real', user);
  const [editor, setEditor] = useState(false);
  const [notice, setNotice] = useState('');
  const client = records.find(row => row.id === params.id);

  if (!supabaseConfigured || !supabase) return <div className="rounded-xl border border-[#e6e9dd] bg-[#fcfbf5] p-5 text-[12px] text-[#786b4e]">Supabase no está configurado.</div>;
  if (authLoading) return <div className="p-6 text-[12px] text-[#71838a]" role="status">Comprobando sesión segura…</div>;
  if (!user) return <SupabaseSignIn onViewDemo={onViewDemo}/>;
  if (loading) return <div className="p-6 text-[12px] text-[#71838a]" role="status">Cargando ficha autorizada…</div>;
  if (error || !client) return <div className="page-enter mx-auto max-w-[620px] py-8"><Link href="/clientes?origen=real" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[11px] font-semibold text-[#168b87] no-underline"><ArrowLeft size={15}/> Volver a clientes</Link><DataError message={error || 'El cliente no existe o no está disponible para esta organización.'}/></div>;

  const saveChanges = async (input: Parameters<typeof save>[0]) => {
    await save(input, client);
    setEditor(false);
    setNotice('Cambios guardados en Supabase.');
    window.setTimeout(() => setNotice(''), 2800);
  };
  const archiveCurrent = async () => {
    if (!window.confirm(`¿Archivar a ${client.nombre}? No se borrará de la base de datos.`)) return;
    try {
      await archive(client);
      setNotice('Cliente archivado como Inactivo.');
      window.setTimeout(() => setNotice(''), 2800);
    } catch (reason) {
      setNotice(reason instanceof Error ? reason.message : 'No se pudo archivar el cliente.');
    }
  };

  return <div className="page-enter space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/clientes?origen=real" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[11px] font-semibold text-[#168b87] no-underline hover:bg-[#e9f6f4]"><ArrowLeft size={15}/> Todos los clientes</Link>
      <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d5ecea] bg-[#f1fbfa] px-3 text-[9px] font-semibold text-[#147d79]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]"/> Datos reales · RLS</span>
    </div>
    {notice && <div className="rounded-lg border border-[#cce9e6] bg-[#eff9f8] px-4 py-3 text-[11px] text-[#167b78]" role="status">{notice}</div>}
    <section className="overflow-hidden rounded-xl border border-[#e1e9eb] bg-white">
      <div className="bg-[#102C3A] px-5 py-6 text-white sm:px-8 sm:py-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[.08] text-[#8ee0d8]"><Building2 size={22}/></span><div><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#91b1b8]">Ficha de cliente · {client.id}</span><h1 className="font-display m-0 mt-1 break-words text-[22px] font-bold sm:text-[28px]">{client.nombre}</h1><p className="mb-0 mt-1 text-[11px] text-[#a8c0c5]">{client.tipo} · Alta {client.fechaAlta || 'sin fecha'}</p></div></div>
          <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${stateTone(client.estado)}`}>{client.estado}</span>{canManage && <><button type="button" onClick={() => setEditor(true)} className="min-h-11 rounded-lg bg-[#00A9A5] px-3.5 text-[10px] font-semibold text-white hover:bg-[#13b8b3]">Editar ficha</button><button type="button" onClick={() => void archiveCurrent()} className="min-h-11 rounded-lg border border-white/20 px-3 text-[10px] font-semibold text-white hover:bg-white/10">Archivar</button></>}</div>
        </div>
      </div>
      <div className="p-5 sm:p-7">
        <h2 className="font-display m-0 text-[15px] font-bold text-[#173744]">Datos del cliente</h2>
        <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['NIF/CIF', client.identificadorFiscal],
            ['Persona de contacto', client.contacto || 'Sin indicar'],
            ['Teléfono', client.telefono],
            ['Correo electrónico', client.email],
            ['Dirección', client.direccion],
            ['Código postal', client.codigoPostal || 'Sin indicar'],
            ['Provincia', client.provincia || 'Sin indicar'],
            ['Comercial asignado', client.comercial],
            ['Observaciones', client.observaciones || 'Sin observaciones'],
          ].map(([label, value]) => <div key={label} className="rounded-lg border border-[#edf1f2] bg-[#fcfdfd] p-3.5"><dt className="text-[10px] text-[#84949a]">{label}</dt><dd className="mb-0 mt-2 break-words text-[12px] font-semibold text-[#31515c]">{value}</dd></div>)}
        </dl>
      </div>
    </section>
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-xl border border-[#e1e9eb] bg-white p-5"><h2 className="font-display m-0 text-[14px] font-bold text-[#173744]">Servicios, contratos y pedidos</h2><p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#71838a]">Las tablas de contratos y pedidos todavía no están conectadas a esta ficha. No se muestran asociaciones ficticias como si fueran reales.</p></section>
      <section className="rounded-xl border border-[#e1e9eb] bg-white p-5"><h2 className="font-display m-0 text-[14px] font-bold text-[#173744]">Historial de actividad</h2><p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#71838a]">El registro de actividad aún no está configurado. La fecha de alta proviene del registro protegido por Supabase.</p></section>
    </div>
    {editor && <ClientFormDialog client={client} dataMode="real" onClose={() => setEditor(false)} onSave={saveChanges}/>}
  </div>;
}
