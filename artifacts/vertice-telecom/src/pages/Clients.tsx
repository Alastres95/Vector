import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams } from 'wouter';
import { ArrowLeft, BriefcaseBusiness, Building2, Check, ChevronRight, CircleAlert, Mail, MapPin, Pencil, Phone, Plus, Search, SlidersHorizontal, Trash2, UserRound, Users, X } from 'lucide-react';
import { demoDate, type Cliente, type DemoRecord } from '../data/demo-data';
import { useDemoData } from '../data/DemoProvider';

type ClientKind = 'Empresa' | 'Particular';
type ClientStatus = 'Activo' | 'Pendiente' | 'Inactivo';
type ClientRecord = Cliente & {
  tipo: ClientKind;
  direccion: string;
};
type ClientDraft = Omit<ClientRecord, 'id'>;
type DraftKey = keyof ClientDraft;

const statusOptions: ClientStatus[] = ['Activo', 'Pendiente', 'Inactivo'];
const commercialFallback = ['Marta Ruiz', 'Diego León', 'Álvaro Gil'];
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toLocaleUpperCase('es') ?? '').join('');
const statusStyles: Record<ClientStatus, string> = {
  Activo: 'bg-[#e8f6f2] text-[#247d69] ring-[#cce9df]',
  Pendiente: 'bg-[#fff5e7] text-[#9b702d] ring-[#f1e2c7]',
  Inactivo: 'bg-[#f8eceb] text-[#a65d58] ring-[#eedbd9]',
};
const statusDot: Record<ClientStatus, string> = {
  Activo: 'bg-[#2d9a7a]',
  Pendiente: 'bg-[#d49b3c]',
  Inactivo: 'bg-[#c87972]',
};
const normalizeStatus = (value: string): ClientStatus => statusOptions.includes(value as ClientStatus) ? value as ClientStatus : 'Pendiente';
const formatDate = (value: string) => value || 'Sin fecha';
const emptyDraft = (): ClientDraft => ({
  tipo: 'Empresa',
  nombre: '',
  identificadorFiscal: '',
  contacto: '',
  telefono: '',
  email: '',
  direccion: '',
  comercial: '',
  estado: 'Activo',
  fechaAlta: demoDate(),
});

function StatusPill({ status }: { status: string }) {
  const normalized = normalizeStatus(status);
  return <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${statusStyles[normalized]}`} data-testid={`client-status-${normalized.toLowerCase()}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[normalized]}`} />{normalized}
  </span>;
}

function DemoNotice({ children }: { children: ReactNode }) {
  return <div className="flex items-start gap-2.5 rounded-lg border border-[#d5eae7] bg-[#f0f9f7] px-3.5 py-3 text-[11px] leading-relaxed text-[#43736e]" role="note">
    <CircleAlert size={15} className="mt-0.5 shrink-0 text-[#188d88]" />
    <span>{children}</span>
  </div>;
}

function ClientEditor({ record, commercials, onClose, onSave }: {
  record: ClientRecord | null;
  commercials: string[];
  onClose: () => void;
  onSave: (draft: ClientDraft, id?: string) => void;
}) {
  const [draft, setDraft] = useState<ClientDraft>(() => record ? {
    tipo: record.tipo ?? 'Empresa',
    nombre: record.nombre ?? '',
    identificadorFiscal: record.identificadorFiscal ?? '',
    contacto: record.contacto ?? '',
    telefono: record.telefono ?? '',
    email: record.email ?? '',
    direccion: record.direccion ?? '',
    comercial: record.comercial ?? '',
    estado: normalizeStatus(record.estado ?? 'Activo'),
    fechaAlta: record.fechaAlta ?? demoDate(),
  } : emptyDraft());
  const [errors, setErrors] = useState<Partial<Record<DraftKey, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (key: DraftKey, value: string) => {
    setDraft(old => {
      const next = { ...old, [key]: value };
      if (key === 'tipo' && value === 'Particular') next.contacto = next.nombre;
      if (key === 'nombre' && next.tipo === 'Particular') next.contacto = value;
      return next;
    });
    setErrors(old => ({ ...old, [key]: undefined, ...(key === 'nombre' && draft.tipo === 'Particular' ? { contacto: undefined } : {}) }));
  };
  const validate = () => {
    const next: Partial<Record<DraftKey, string>> = {};
    if (!draft.tipo) next.tipo = 'Selecciona el tipo de cliente.';
    if (!draft.nombre.trim()) next.nombre = draft.tipo === 'Empresa' ? 'Indica la razón social.' : 'Indica el nombre completo.';
    if (!draft.identificadorFiscal.trim()) next.identificadorFiscal = 'El NIF/CIF es obligatorio.';
    if (!draft.telefono.trim()) next.telefono = 'Indica un teléfono de contacto.';
    if (!draft.email.trim()) next.email = 'El correo electrónico es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(draft.email.trim())) next.email = 'Introduce un correo válido, por ejemplo nombre@empresa.es.';
    if (!draft.direccion.trim()) next.direccion = 'Indica la dirección del cliente.';
    if (!draft.comercial.trim()) next.comercial = 'Asigna un comercial responsable.';
    if (!draft.estado) next.estado = 'Selecciona un estado.';
    if (draft.tipo === 'Empresa' && !draft.contacto.trim()) next.contacto = 'Indica la persona de contacto.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    const saved = { ...draft, nombre: draft.nombre.trim(), identificadorFiscal: draft.identificadorFiscal.trim(), telefono: draft.telefono.trim(), email: draft.email.trim(), direccion: draft.direccion.trim(), comercial: draft.comercial.trim(), contacto: draft.tipo === 'Particular' ? draft.nombre.trim() : draft.contacto.trim() };
    onSave(saved, record?.id);
  };
  const fieldClass = (key: DraftKey) => `min-h-11 w-full rounded-lg border bg-white px-3 text-[12px] text-[#173744] outline-none transition focus:border-[#65c4bd] focus:ring-2 focus:ring-[#00a9a5]/10 ${errors[key] ? 'border-[#d8948e]' : 'border-[#dfe8e9]'}`;
  const renderField = (key: DraftKey, label: string, placeholder: string, props: { type?: string; autoComplete?: string; disabled?: boolean; helper?: string } = {}) => (
    <label className="block" key={key}>
      <span className="mb-1.5 block text-[11px] font-semibold text-[#425e67]">{label}<span className="text-[#c26c64]"> *</span></span>
      <input
        type={props.type ?? 'text'}
        value={String(draft[key] ?? '')}
        onChange={event => update(key, event.target.value)}
        placeholder={placeholder}
        autoComplete={props.autoComplete}
        disabled={props.disabled}
        required
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `client-error-${key}` : props.helper ? `client-help-${key}` : undefined}
        className={fieldClass(key)}
        data-testid={`input-client-${key}`}
      />
      {errors[key] && <span id={`client-error-${key}`} className="mt-1 block text-[10px] text-[#a5534c]" role="alert">{errors[key]}</span>}
      {!errors[key] && props.helper && <span id={`client-help-${key}`} className="mt-1 block text-[10px] text-[#8b9a9f]">{props.helper}</span>}
    </label>
  );

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#102c3a]/50 px-0 pt-5 sm:items-center sm:p-4" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }} role="presentation">
      <form onSubmit={submit} noValidate className="flex max-h-[calc(100dvh-14px)] w-full max-w-[700px] flex-col overflow-hidden rounded-t-2xl border border-[#dce7e8] bg-[#fbfdfd] shadow-2xl shadow-[#102c3a]/20 sm:max-h-[min(92dvh,850px)] sm:rounded-2xl" data-testid="form-client">
        <div className="flex shrink-0 items-start justify-between border-b border-[#e8eeee] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[.16em] text-[#168b86]">{record ? 'Ficha de cliente · edición local' : 'Alta local de demostración'}</span>
            <h2 className="font-display mb-0 mt-1 text-[20px] font-bold tracking-[-.03em] text-[#102c3a]">{record ? 'Editar cliente' : 'Añadir cliente'}</h2>
            <p className="mb-0 mt-1 text-[11px] text-[#819198]">Los cambios se guardan solo en esta demostración del navegador.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar formulario" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#72858b] transition hover:bg-[#f1f6f6] hover:text-[#173744]" data-testid="button-close-client-form"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
          {submitted && Object.keys(errors).length > 0 && <div className="rounded-lg border border-[#efd8d5] bg-[#fff6f5] px-3.5 py-3 text-[11px] text-[#9b544d]" role="alert">Revisa los campos señalados para guardar la ficha.</div>}
          <section>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#73888e]"><span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e8f5f3] text-[#168b86]">01</span> Identificación</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold text-[#425e67]">Tipo de cliente<span className="text-[#c26c64]"> *</span></span>
                <select value={draft.tipo} onChange={event => update('tipo', event.target.value)} className={fieldClass('tipo')} aria-invalid={Boolean(errors.tipo)} aria-describedby={errors.tipo ? 'client-error-tipo' : undefined} data-testid="select-client-tipo">
                  <option value="Empresa">Empresa</option><option value="Particular">Particular</option>
                </select>
                {errors.tipo && <span id="client-error-tipo" className="mt-1 block text-[10px] text-[#a5534c]" role="alert">{errors.tipo}</span>}
              </label>
              {renderField('identificadorFiscal', 'NIF/CIF', 'Ej. B-81420576')}
              <div className="sm:col-span-2">{renderField('nombre', draft.tipo === 'Empresa' ? 'Razón social' : 'Nombre completo', draft.tipo === 'Empresa' ? 'Nombre legal de la empresa' : 'Nombre y apellidos')}</div>
            </div>
          </section>
          <section>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#73888e]"><span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e8f5f3] text-[#168b86]">02</span> Contacto y dirección</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {draft.tipo === 'Empresa' && renderField('contacto', 'Persona de contacto', 'Nombre de la persona responsable')}
              {renderField('telefono', 'Teléfono', '+34 600 000 000', { type: 'tel', autoComplete: 'tel' })}
              {renderField('email', 'Correo electrónico', 'nombre@empresa.es', { type: 'email', autoComplete: 'email' })}
              <div className="sm:col-span-2">{renderField('direccion', 'Dirección completa', 'Calle, número, código postal y localidad', { autoComplete: 'street-address' })}</div>
            </div>
            {draft.tipo === 'Particular' && <p className="mb-0 mt-2 text-[10px] text-[#819198]">La persona de contacto se completará con el nombre del cliente.</p>}
          </section>
          <section>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#73888e]"><span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#e8f5f3] text-[#168b86]">03</span> Seguimiento comercial</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold text-[#425e67]">Comercial asignado<span className="text-[#c26c64]"> *</span></span>
                <select value={draft.comercial} onChange={event => update('comercial', event.target.value)} className={fieldClass('comercial')} aria-invalid={Boolean(errors.comercial)} data-testid="select-client-comercial">
                  <option value="">Seleccionar comercial</option>{commercials.map(person => <option key={person} value={person}>{person}</option>)}
                </select>
                {errors.comercial && <span className="mt-1 block text-[10px] text-[#a5534c]" role="alert">{errors.comercial}</span>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold text-[#425e67]">Estado<span className="text-[#c26c64]"> *</span></span>
                <select value={draft.estado} onChange={event => update('estado', event.target.value)} className={fieldClass('estado')} data-testid="select-client-estado">
                  {statusOptions.map(status => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>
          </section>
          <DemoNotice>Esta ficha es ficticia. El guardado modifica únicamente los datos locales de demostración y no envía información a ningún servicio.</DemoNotice>
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-[#e8eeee] bg-white px-5 py-3.5 sm:px-7" style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 14px)' }}>
          <button type="button" onClick={onClose} className="min-h-11 rounded-lg border border-[#dfe8e9] px-4 text-[11px] font-semibold text-[#5b727a] transition hover:bg-[#f7fafa]" data-testid="button-cancel-client">Cancelar</button>
          <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[11px] font-semibold text-white transition hover:bg-[#008f8c] active:scale-[.98]" data-testid="button-save-client"><Check size={15} /> Guardar ficha</button>
        </div>
      </form>
    </div>,
    document.body,
  );
}

function useClientData() {
  const repo = useDemoData();
  const clients = repo.list('clientes') as unknown as ClientRecord[];
  const commercials = useMemo(() => {
    const fromUsers = repo.list('usuarios').filter(user => /comercial/i.test(user.rol) || user.rol === 'Administrador').map(user => user.nombre);
    const existing = clients.map(client => client.comercial).filter(Boolean);
    return [...new Set([...fromUsers, ...commercialFallback, ...existing])];
  }, [repo, clients]);
  return { repo, clients, commercials };
}

export function ClientsPage() {
  const { repo, clients, commercials } = useClientData();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [editor, setEditor] = useState<ClientRecord | null | undefined>(undefined);
  const [notice, setNotice] = useState('');
  const visible = useMemo(() => clients.filter(client => {
    const matchesText = `${client.nombre} ${client.identificadorFiscal}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'));
    return matchesText && (filter === 'Todos' || normalizeStatus(client.estado) === filter);
  }), [clients, query, filter]);
  const counters = useMemo(() => ({
    Activo: clients.filter(client => normalizeStatus(client.estado) === 'Activo').length,
    Pendiente: clients.filter(client => normalizeStatus(client.estado) === 'Pendiente').length,
    Inactivo: clients.filter(client => normalizeStatus(client.estado) === 'Inactivo').length,
  }), [clients]);
  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };
  const save = (draft: ClientDraft, id?: string) => {
    if (id) repo.update('clientes', id, draft as Partial<DemoRecord>);
    else repo.create('clientes', { ...draft, id: `CLI-${Date.now().toString().slice(-5)}` } as unknown as DemoRecord);
    setEditor(undefined);
    toast(id ? 'Cambios guardados en los datos locales de demostración.' : 'Cliente añadido a los datos locales de demostración.');
  };
  const toggleStatus = (client: ClientRecord) => {
    const current = normalizeStatus(client.estado);
    const next: ClientStatus = current === 'Activo' ? 'Pendiente' : current === 'Pendiente' ? 'Inactivo' : 'Activo';
    repo.update('clientes', client.id, { estado: next } as Partial<DemoRecord>);
    toast(`Estado cambiado a ${next}. Actualización solo de demostración.`);
  };
  const remove = (client: ClientRecord) => {
    if (!window.confirm(`¿Eliminar la ficha de ${client.nombre} de los datos de demostración?`)) return;
    repo.remove('clientes', client.id);
    toast('Ficha eliminada de los datos locales de demostración.');
  };
  const openNew = () => setEditor(null);
  return <div className="page-enter space-y-5">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#87979c]"><span>Espacio de trabajo</span><ChevronRight size={12} /><span className="text-[#168b86]">Clientes</span></div>
        <h1 className="font-display m-0 text-[30px] font-bold tracking-[-.045em] text-[#102C3A] sm:text-[35px]" data-testid="page-title">Clientes</h1>
        <p className="mb-0 mt-1.5 text-[12px] text-[#71838a]">Relaciones comerciales y datos de contacto en un solo lugar.</p>
      </div>
      <button onClick={openNew} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#00A9A5] px-4 text-[11px] font-semibold text-white shadow-sm shadow-[#00a9a5]/15 transition hover:bg-[#008f8c] active:scale-[.98] sm:self-auto" data-testid="button-create-client"><Plus size={16} /> Añadir cliente</button>
    </div>

    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {([
        ['Todos', clients.length, 'Total de clientes'],
        ['Activo', counters.Activo, 'Activos'],
        ['Pendiente', counters.Pendiente, 'Pendientes'],
      ] as [string, number, string][]).map(([key, value, label], index) => <button key={key} onClick={() => setFilter(key)} className={`min-h-[78px] rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm sm:px-4 ${filter === key ? 'border-[#abdcd8] bg-[#f1faf9]' : 'border-[#e2eaec] bg-white'}`} data-testid={`filter-summary-${key.toLowerCase()}`} aria-pressed={filter === key}>
        <span className="block text-[9px] font-semibold text-[#7d9096] sm:text-[10px]">{label}</span><strong className={`mt-1 block text-[22px] font-bold tracking-[-.04em] sm:text-[25px] ${index === 0 ? 'text-[#102c3a]' : index === 1 ? 'text-[#247d69]' : 'text-[#9b702d]'}`}>{value}</strong>
      </button>)}
    </div>

    {notice && <div className="flex items-center justify-between gap-3 rounded-lg border border-[#cce9e6] bg-[#eff9f8] px-4 py-3 text-[11px] font-medium text-[#167b78]" role="status" data-testid="status-client-notice"><span className="flex items-center gap-2"><Check size={15} />{notice}</span><button onClick={() => setNotice('')} className="flex min-h-8 min-w-8 items-center justify-center rounded text-[#167b78] hover:bg-[#dff3f0]" aria-label="Cerrar aviso"><X size={14} /></button></div>}

    <section className="overflow-hidden rounded-xl border border-[#e1e9eb] bg-white shadow-sm shadow-[#102c3a]/[.02]">
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf1f2] p-4 sm:flex-row sm:items-center sm:px-5">
        <div className="relative w-full sm:max-w-[350px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a0a5]" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nombre o NIF/CIF" aria-label="Buscar clientes por nombre o NIF/CIF" className="h-11 w-full rounded-lg border border-[#e2eaec] bg-[#fbfcfc] pl-9 pr-3 text-[11px] text-[#294752] outline-none placeholder:text-[#a1adb1] focus:border-[#69c8c3] focus:ring-2 focus:ring-[#00a9a5]/10" data-testid="input-search-clients" /></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] text-[#84949a]"><SlidersHorizontal size={13} /> Estado</span>
          <select value={filter} onChange={event => setFilter(event.target.value)} aria-label="Filtrar clientes por estado" className="min-h-11 min-w-[130px] rounded-lg border border-[#e2eaec] bg-white px-3 text-[10px] font-medium text-[#526a73] outline-none focus:border-[#69c8c3]" data-testid="select-filter-clients">
            <option>Todos</option>{statusOptions.map(status => <option key={status}>{status}</option>)}
          </select>
          <span className="ml-auto rounded-md bg-[#f2f6f7] px-2.5 py-2 text-[10px] font-medium text-[#71838a]" data-testid="count-clients">{visible.length} de {clients.length}</span>
        </div>
      </div>
      {visible.length ? <>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead><tr className="border-b border-[#edf1f2] bg-[#f8fafb] text-[9px] font-bold uppercase tracking-[.12em] text-[#84949a]"><th className="px-5 py-3">Cliente</th><th className="px-4 py-3">NIF/CIF</th><th className="px-4 py-3">Contacto</th><th className="px-4 py-3">Comercial</th><th className="px-4 py-3">Alta</th><th className="px-4 py-3">Estado</th><th className="w-[116px] px-4 py-3 text-right">Acciones</th></tr></thead>
            <tbody>{visible.map(client => <tr key={client.id} className="group border-b border-[#f0f3f4] last:border-0 transition-colors hover:bg-[#fbfdfd]" data-testid={`row-client-${client.id}`}>
              <td className="px-5 py-3.5"><Link href={`/clientes/${client.id}`} className="flex min-w-0 items-center gap-3 no-underline" data-testid={`link-client-${client.id}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f5f3] text-[10px] font-bold text-[#167f7a]">{initials(client.nombre)}</span><span className="min-w-0"><strong className="block truncate text-[11px] font-semibold text-[#21434e] group-hover:text-[#087f7b]">{client.nombre}</strong><span className="mt-0.5 block text-[9px] text-[#95a2a7]">{client.tipo ?? 'Cliente'} · {client.id}</span></span></Link></td>
              <td className="px-4 py-3.5 text-[10px] font-medium text-[#59717a]">{client.identificadorFiscal}</td>
              <td className="px-4 py-3.5"><span className="block text-[10px] font-medium text-[#47616b]">{client.contacto || '—'}</span><span className="mt-0.5 block text-[9px] text-[#8a999f]">{client.email}</span></td>
              <td className="px-4 py-3.5 text-[10px] text-[#59717a]">{client.comercial || '—'}</td>
              <td className="px-4 py-3.5 text-[10px] text-[#71838a]">{client.fechaAlta || '—'}</td>
              <td className="px-4 py-3.5"><StatusPill status={client.estado} /></td>
              <td className="px-4 py-2.5"><div className="flex justify-end gap-1">
                <Link href={`/clientes/${client.id}`} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#168b87] transition hover:bg-[#e9f6f4]" aria-label={`Ver ficha de ${client.nombre}`} title="Ver ficha" data-testid={`button-view-client-${client.id}`}><ChevronRight size={16} /></Link>
                <button onClick={() => setEditor(client)} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#56717b] transition hover:bg-[#edf3f4]" aria-label={`Editar ${client.nombre}`} title="Editar" data-testid={`button-edit-client-${client.id}`}><Pencil size={14} /></button>
                <button onClick={() => toggleStatus(client)} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#168b87] transition hover:bg-[#e9f6f4]" aria-label={`Cambiar estado de ${client.nombre}`} title="Cambiar estado" data-testid={`button-status-client-${client.id}`}><SlidersHorizontal size={14} /></button>
                <button onClick={() => remove(client)} className="flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#a96c67] transition hover:bg-[#fbefee]" aria-label={`Eliminar ${client.nombre}`} title="Eliminar" data-testid={`button-delete-client-${client.id}`}><Trash2 size={14} /></button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="space-y-3 p-3 md:hidden" data-testid="mobile-client-records">
          {visible.map(client => <article key={client.id} className="rounded-xl border border-[#e3eaec] bg-white p-4 shadow-sm shadow-[#102c3a]/[.025]" data-testid={`card-client-${client.id}`}>
            <div className="flex items-start justify-between gap-3"><Link href={`/clientes/${client.id}`} className="flex min-w-0 items-center gap-3 no-underline" data-testid={`mobile-link-client-${client.id}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f3] text-[10px] font-bold text-[#167f7a]">{initials(client.nombre)}</span><span className="min-w-0"><strong className="block break-words text-[12px] font-semibold text-[#21434e]">{client.nombre}</strong><span className="mt-0.5 block text-[9px] text-[#8a999f]">{client.tipo ?? 'Cliente'} · {client.id}</span></span></Link><StatusPill status={client.estado} /></div>
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-[#edf1f2] pt-3"><div><dt className="text-[9px] text-[#8a999f]">NIF/CIF</dt><dd className="mb-0 mt-0.5 text-[10px] font-medium text-[#536b74]">{client.identificadorFiscal}</dd></div><div><dt className="text-[9px] text-[#8a999f]">Contacto</dt><dd className="mb-0 mt-0.5 text-[10px] text-[#536b74]">{client.contacto || '—'}</dd></div><div><dt className="text-[9px] text-[#8a999f]">Comercial</dt><dd className="mb-0 mt-0.5 text-[10px] text-[#536b74]">{client.comercial || '—'}</dd></div><div><dt className="text-[9px] text-[#8a999f]">Alta</dt><dd className="mb-0 mt-0.5 text-[10px] text-[#536b74]">{client.fechaAlta || '—'}</dd></div></dl>
            <div className="mt-3 flex justify-end gap-1 border-t border-[#edf1f2] pt-2">
              <Link href={`/clientes/${client.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold text-[#168b87] transition hover:bg-[#e9f6f4]" data-testid={`button-mobile-view-client-${client.id}`}>Ver ficha <ChevronRight size={14} /></Link>
              <button onClick={() => setEditor(client)} aria-label={`Editar ${client.nombre}`} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#56717b] transition hover:bg-[#edf3f4]" data-testid={`button-mobile-edit-client-${client.id}`}><Pencil size={15} /></button>
              <button onClick={() => toggleStatus(client)} aria-label={`Cambiar estado de ${client.nombre}`} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#168b87] transition hover:bg-[#e9f6f4]" data-testid={`button-mobile-status-client-${client.id}`}><SlidersHorizontal size={15} /></button>
              <button onClick={() => remove(client)} aria-label={`Eliminar ${client.nombre}`} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#a96c67] transition hover:bg-[#fbefee]" data-testid={`button-mobile-delete-client-${client.id}`}><Trash2 size={15} /></button>
            </div>
          </article>)}
        </div>
      </> : <div className="flex flex-col items-center px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef7f6] text-[#198d88]"><Users size={20} /></span>
        <h2 className="font-display mb-0 mt-4 text-[15px] font-bold text-[#294752]">{clients.length ? 'No hay coincidencias' : 'Tu cartera empieza aquí'}</h2>
        <p className="mb-0 mt-1.5 max-w-[340px] text-[11px] leading-relaxed text-[#829198]">{clients.length ? 'Prueba otro nombre o NIF/CIF, o cambia el filtro de estado.' : 'Añade un cliente ficticio para explorar la ficha y los flujos locales.'}</p>
        {!clients.length && <button onClick={openNew} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[11px] font-semibold text-white hover:bg-[#008f8c]" data-testid="button-empty-create-client"><Plus size={15} /> Añadir cliente</button>}
      </div>}
      <div className="flex items-center justify-between border-t border-[#edf1f2] bg-[#fcfdfd] px-4 py-3 text-[9px] text-[#98a5aa] sm:px-5"><span>Datos de demostración · almacenamiento local</span><span>{visible.length} resultados</span></div>
    </section>
    {editor !== undefined && <ClientEditor record={editor} commercials={commercials} onClose={() => setEditor(undefined)} onSave={save} />}
  </div>;
}

export function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const { repo, clients, commercials } = useClientData();
  const [editor, setEditor] = useState(false);
  const [notice, setNotice] = useState('');
  const client = clients.find(row => row.id === params.id);
  const toast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3200);
  };
  const save = (draft: ClientDraft, id?: string) => {
    if (!id) return;
    repo.update('clientes', id, draft as Partial<DemoRecord>);
    setEditor(false);
    toast('Cambios guardados en los datos locales de demostración.');
  };
  if (!client) return <div className="page-enter mx-auto max-w-[620px] py-8">
    <Link href="/clientes" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[11px] font-semibold text-[#168b87] no-underline hover:bg-[#e9f6f4]" data-testid="link-back-clients"><ArrowLeft size={15} /> Volver a clientes</Link>
    <section className="mt-4 rounded-xl border border-[#e1e9eb] bg-white px-6 py-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f7f7] text-[#84949a]"><Users size={20} /></span><h1 className="font-display mb-0 mt-4 text-[19px] font-bold text-[#102c3a]">No encontramos esta ficha</h1><p className="mb-0 mt-2 text-[12px] text-[#7b8d93]">Puede que el registro ya no esté disponible en los datos locales de demostración.</p><Link href="/clientes" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[#00A9A5] px-4 text-[11px] font-semibold text-white no-underline hover:bg-[#008f8c]" data-testid="link-return-client-list">Ir al listado</Link></section>
  </div>;
  const detailRows = [
    { label: client.tipo === 'Empresa' ? 'Razón social' : 'Nombre completo', value: client.nombre, icon: client.tipo === 'Particular' ? UserRound : Building2 },
    { label: 'NIF/CIF', value: client.identificadorFiscal, icon: BriefcaseBusiness },
    ...(client.tipo === 'Particular' ? [] : [{ label: 'Persona de contacto', value: client.contacto || 'Sin indicar', icon: UserRound }]),
    { label: 'Teléfono', value: client.telefono || 'Sin indicar', icon: Phone },
    { label: 'Correo electrónico', value: client.email || 'Sin indicar', icon: Mail },
    { label: 'Dirección', value: client.direccion || 'Sin dirección registrada', icon: MapPin },
  ];
  return <div className="page-enter space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/clientes" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-[11px] font-semibold text-[#168b87] no-underline transition hover:bg-[#e9f6f4]" data-testid="link-back-clients"><ArrowLeft size={15} /> Todos los clientes</Link>
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d5ecea] bg-[#f1fbfa] px-3 py-2 text-[9px] font-semibold text-[#147d79]"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]" /> Datos de demostración</span>
    </div>
    {notice && <div className="rounded-lg border border-[#cce9e6] bg-[#eff9f8] px-4 py-3 text-[11px] text-[#167b78]" role="status" data-testid="status-client-detail-notice">{notice}</div>}
    <section className="overflow-hidden rounded-xl border border-[#e1e9eb] bg-white shadow-sm shadow-[#102c3a]/[.025]">
      <div className="relative overflow-hidden bg-[#102C3A] px-5 py-6 text-white sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border border-white/[.08]" />
        <div className="pointer-events-none absolute -right-2 -top-14 h-44 w-44 rounded-full border border-[#00a9a5]/25" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[.08] text-[15px] font-bold text-[#8ee0d8]">{initials(client.nombre)}</span>
            <div className="min-w-0"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-[9px] font-bold uppercase tracking-[.15em] text-[#91b1b8]">Ficha del cliente</span><span className="text-[#6b8991]">/</span><span className="text-[9px] text-[#91b1b8]">{client.id}</span></div><h1 className="font-display m-0 break-words text-[23px] font-bold tracking-[-.035em] sm:text-[28px]" data-testid="client-detail-name">{client.nombre}</h1><p className="mb-0 mt-1 text-[11px] text-[#a8c0c5]">{client.tipo ?? 'Cliente'} <span className="px-1.5 text-[#718e95]">·</span> Alta {formatDate(client.fechaAlta)}</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <StatusPill status={client.estado} />
            <button onClick={() => setEditor(true)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00A9A5] px-3.5 text-[10px] font-semibold text-white transition hover:bg-[#13b8b3]" data-testid="button-edit-client-detail"><Pencil size={14} /> Editar ficha</button>
          </div>
        </div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1fr_290px]">
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-display m-0 text-[15px] font-bold text-[#173744]">Datos de cliente</h2><p className="mb-0 mt-1 text-[10px] text-[#819198]">Información completa registrada en esta ficha local.</p></div><span className="rounded-md bg-[#f3f7f7] px-2 py-1 text-[9px] font-medium text-[#7e9095]">FICHA · DEMO</span></div>
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {detailRows.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-lg border border-[#edf1f2] bg-[#fcfdfd] p-3.5 transition hover:border-[#d8e9e7] hover:bg-[#f9fcfb]"><dt className="flex items-center gap-2 text-[10px] font-medium text-[#84949a]"><Icon size={13} className="text-[#168b86]" />{label}</dt><dd className="mb-0 mt-2 break-words text-[12px] font-semibold text-[#31515c]">{value}</dd></div>)}
          </dl>
        </div>
        <aside className="border-t border-[#edf1f2] bg-[#f8fbfb] p-5 sm:p-7 lg:border-l lg:border-t-0">
          <h2 className="font-display m-0 text-[14px] font-bold text-[#173744]">Seguimiento comercial</h2>
          <p className="mb-0 mt-1 text-[10px] text-[#819198]">Responsable y situación de la relación.</p>
          <div className="mt-4 rounded-lg border border-[#e5ecee] bg-white p-4">
            <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f5f3] text-[10px] font-bold text-[#167f7a]">{initials(client.comercial || '?')}</span><div className="min-w-0"><span className="block text-[9px] text-[#89999e]">Comercial asignado</span><strong className="mt-0.5 block truncate text-[11px] text-[#31515c]">{client.comercial || 'Sin asignar'}</strong></div></div>
            <div className="mt-4 border-t border-[#edf1f2] pt-3"><span className="block text-[9px] text-[#89999e]">Estado actual</span><div className="mt-2"><StatusPill status={client.estado} /></div></div>
          </div>
          <DemoNotice>Esta ficha forma parte del entorno de demostración. Los datos son ficticios y permanecen en el almacenamiento local de este navegador.</DemoNotice>
        </aside>
      </div>
    </section>
    {editor && <ClientEditor record={client} commercials={commercials} onClose={() => setEditor(false)} onSave={save} />}
  </div>;
}
