import { useMemo, useState, type FormEvent } from 'react';
import { ArrowDownToLine, Check, CircleAlert, FilePlus2, Plus, RotateCcw, Search, Settings2, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'wouter';
import { moduleMeta, seedData, type CollectionKey, type DemoRecord } from '../data/demo-data';
import { useDemoData } from '../data/DemoProvider';

const money = (value: unknown) => typeof value === 'number' ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value) : String(value ?? '—');
const statusClass = (value: string) => {
  const s = value.toLowerCase();
  if (['activo','activa','cerrada','completado','pagada','resuelta','aprobada'].some(x=>s.includes(x))) return 'bg-[#eaf7f1] text-[#27836a]';
  if (['pendiente','curso','instalación','abierta'].some(x=>s.includes(x))) return 'bg-[#fff4e5] text-[#a9782f]';
  if (['cancelado','inactivo'].some(x=>s.includes(x))) return 'bg-[#fbeceb] text-[#b45953]';
  return 'bg-[#eef2f4] text-[#657981]';
};

export function ModulePage({ collection }: { collection: CollectionKey }) {
  const repo = useDemoData();
  const records = repo.list(collection);
  const meta = moduleMeta[collection];
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [dialog, setDialog] = useState<DemoRecord | 'new' | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  const visible = useMemo(() => records.filter((row) => {
    const text = Object.values(row).join(' ').toLocaleLowerCase('es');
    return text.includes(query.toLocaleLowerCase('es')) && (filter === 'Todos' || String((row as Record<string, unknown>).estado ?? '') === filter);
  }), [records, query, filter]);
  const states = [...new Set(records.map(r => String((r as Record<string, unknown>).estado ?? '')).filter(Boolean))];
  const openEditor = (record: DemoRecord | 'new') => {
    setDialog(record);
    const template = record === 'new' ? (seedData[collection][0] ?? { id: '' }) : record;
    setDraft(Object.fromEntries(Object.entries(template).filter(([key]) => key !== 'id').map(([key,value]) => [key, record === 'new' && key !== 'estado' ? '' : String(value)])));
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    const editing = dialog !== 'new' && dialog !== null;
    const template = editing ? dialog as DemoRecord : (seedData[collection][0] ?? { id: '' }) as DemoRecord;
    const id = editing ? template.id : `${collection.slice(0,3).toUpperCase()}-${Date.now().toString().slice(-5)}`;
    const updated = { ...template, id } as Record<string, unknown>;
    Object.entries(draft).forEach(([key,value]) => {
      const original = (template as unknown as Record<string, unknown>)[key];
      updated[key] = typeof original === 'number' ? Number(value) || 0 : value;
    });
    if (editing) repo.update(collection, id, updated as Partial<DemoRecord>);
    else repo.create(collection, updated as DemoRecord);
    setDialog(null); setNotice(editing ? 'Los cambios de demostración se han guardado.' : `Se ha añadido ${meta.singular} al entorno demo.`);
    window.setTimeout(() => setNotice(''), 2800);
  };
  const changeStatus = (record: DemoRecord) => {
    const original = String((record as Record<string, unknown>).estado ?? '');
    const next = /pendiente|abierta/i.test(original) ? 'En curso' : /curso|instalación/i.test(original) ? 'Completado' : 'Activo';
    repo.update(collection, record.id, { estado: next } as Partial<DemoRecord>);
    setNotice(`Estado actualizado a «${next}» (solo en esta demo).`);
    window.setTimeout(() => setNotice(''), 2400);
  };
  const remove = (record: DemoRecord) => {
    if (window.confirm(`¿Eliminar este registro de demostración (${record.id})?`)) {
      repo.remove(collection, record.id);
      setNotice('Registro eliminado del entorno de demostración.');
      window.setTimeout(() => setNotice(''), 2400);
    }
  };
  const formatCell = (key: string, value: unknown) => {
    if (key === 'estado') return <span data-testid={`status-${collection}-${String((value as string) || '').toLowerCase().replaceAll(' ','-')}`} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusClass(String(value))}`}><span className="h-1 w-1 rounded-full bg-current"/>{String(value)}</span>;
    if (['importe','precioMensual','comision'].includes(key)) return <span className="font-semibold text-[#294752]">{key === 'comision' && collection === 'tarifas' ? `${money(value)}` : money(value)}</span>;
    return <span>{String(value ?? '—')}</span>;
  };
  return <div className="page-enter space-y-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#82939a]"><span>Gestión</span><span className="text-[#b7c3c7]">/</span><span className="text-[#138c88]">{meta.title}</span></div><h1 className="font-display m-0 text-[29px] font-bold tracking-[-.04em] text-[#102C3A] sm:text-[34px]" data-testid="page-title">{meta.title}</h1><p className="mb-0 mt-1.5 text-[13px] text-[#71828a]">{meta.subtitle}</p></div>
      <div className="flex items-center gap-2"><span className="hidden items-center gap-1.5 rounded-full border border-[#d6ecea] bg-[#eff9f8] px-2.5 py-1.5 text-[10px] font-semibold text-[#167b78] sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#00A9A5]"/> Datos de demostración</span><button onClick={() => openEditor('new')} data-testid={`button-create-${collection}`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#00A9A5] px-3.5 text-[11px] font-semibold text-white hover:bg-[#008f8c]"><Plus size={15}/> Añadir {meta.singular}</button></div>
    </div>
    {notice && <div className="flex items-center justify-between rounded-lg border border-[#cce9e6] bg-[#eff9f8] px-4 py-3 text-[11px] font-medium text-[#167b78]" role="status" data-testid="status-notice"><span className="flex items-center gap-2"><Check size={15}/>{notice}</span><button onClick={()=>setNotice('')} aria-label="Cerrar aviso"><X size={14}/></button></div>}
    {collection === 'operadores' && <div className="flex items-start gap-3 rounded-lg border border-[#e6e9dd] bg-[#fcfbf5] px-4 py-3.5"><CircleAlert size={16} className="mt-0.5 shrink-0 text-[#ad8739]"/><p className="m-0 text-[11px] leading-relaxed text-[#786b4e]">Este catálogo es únicamente informativo. No existe conexión ni intercambio de datos con operadores mayoristas.</p></div>}
    <section className="overflow-hidden rounded-xl border border-[#e3eaec] bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf1f2] p-4 sm:flex-row sm:items-center sm:px-5">
        <div className="relative w-full sm:max-w-[320px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a0a5]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={`Buscar ${meta.title.toLocaleLowerCase('es')}…`} aria-label={`Buscar ${meta.title}`} data-testid={`input-search-${collection}`} className="h-9 w-full rounded-lg border border-[#e3eaec] bg-[#fbfcfc] pl-9 pr-3 text-[11px] text-[#294752] outline-none placeholder:text-[#a1adb1] focus:border-[#69c8c3] focus:ring-2 focus:ring-[#00a9a5]/10"/></div>
        <div className="flex flex-wrap items-center gap-2"><div className="flex items-center gap-1.5 text-[10px] text-[#84949a]"><SlidersHorizontal size={13}/> Estado</div><select value={filter} onChange={e=>setFilter(e.target.value)} data-testid={`select-filter-${collection}`} className="h-9 min-w-[120px] rounded-lg border border-[#e3eaec] bg-white px-3 text-[10px] font-medium text-[#526a73] outline-none focus:border-[#69c8c3]"><option>Todos</option>{states.map(s=><option key={s}>{s}</option>)}</select><span className="ml-auto rounded-md bg-[#f2f6f7] px-2.5 py-1.5 text-[10px] font-medium text-[#71838a]" data-testid={`count-${collection}`}>{visible.length} registros</span></div>
      </div>
      {visible.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left"><thead><tr className="border-b border-[#edf1f2] bg-[#f8fafb] text-[9px] font-bold uppercase tracking-[.12em] text-[#84949a]">{meta.columns.map(col=><th key={col.key} className="px-5 py-3 font-semibold">{col.label}</th>)}<th className="w-[110px] px-4 py-3 text-right font-semibold">Acciones</th></tr></thead><tbody>{visible.map((row,index)=><tr key={row.id} data-testid={`row-${collection}-${row.id}`} className="group border-b border-[#f0f3f4] last:border-0 hover:bg-[#fbfdfd]">
        {meta.columns.map((col,colIndex)=><td key={col.key} className={`px-5 py-3.5 text-[11px] ${colIndex===0?'font-semibold text-[#294752]':'text-[#657981]'}`} data-testid={`cell-${collection}-${row.id}-${col.key}`}>{formatCell(col.key,(row as Record<string,unknown>)[col.key])}</td>)}
        <td className="px-4 py-2.5"><div className="flex justify-end gap-1 opacity-60 transition group-hover:opacity-100"><button onClick={()=>changeStatus(row)} title="Cambiar estado demo" aria-label={`Cambiar estado de ${row.id}`} data-testid={`button-status-${row.id}`} className="rounded-md p-1.5 text-[#168b87] hover:bg-[#e9f6f4]"><RotateCcw size={13}/></button><button onClick={()=>openEditor(row)} title="Editar" aria-label={`Editar ${row.id}`} data-testid={`button-edit-${row.id}`} className="rounded-md p-1.5 text-[#56717b] hover:bg-[#edf3f4]"><Settings2 size={13}/></button><button onClick={()=>remove(row)} title="Eliminar" aria-label={`Eliminar ${row.id}`} data-testid={`button-delete-${row.id}`} className="rounded-md p-1.5 text-[#a96c67] hover:bg-[#fbefee]"><X size={14}/></button></div></td>
      </tr>)}</tbody></table></div> : <div className="flex flex-col items-center px-6 py-14 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef7f6] text-[#198d88]"><Search size={19}/></span><h3 className="font-display mb-0 mt-4 text-[14px] font-bold text-[#294752]">{records.length ? 'No hay resultados' : `Todavía no hay ${meta.title.toLocaleLowerCase('es')}`}</h3><p className="mb-0 mt-1.5 max-w-[340px] text-[11px] leading-relaxed text-[#829198]">{records.length ? 'Prueba con otro término o cambia el filtro para ver más registros.' : 'Puedes crear un registro ficticio para explorar cómo funciona este módulo.'}</p>{!records.length && <button onClick={()=>openEditor('new')} className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#008f8c]" data-testid={`button-empty-create-${collection}`}><Plus size={14}/> Añadir {meta.singular}</button>}</div>}
      <div className="flex items-center justify-between border-t border-[#edf1f2] bg-[#fcfdfd] px-4 py-3 text-[9px] text-[#98a5aa] sm:px-5"><span>Vista local · datos ficticios</span><span>{visible.length} de {records.length}</span></div>
    </section>
    {dialog && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#102c3a]/35 p-4" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDialog(null)}}><form onSubmit={save} className="max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-[#dfe8e9] bg-white p-5 shadow-xl shadow-[#102c3a]/15 sm:p-7" data-testid={`form-${collection}`}>
      <div className="flex items-start justify-between"><div><span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#148e89]">{dialog === 'new' ? 'Nuevo registro demo' : 'Edición local'}</span><h2 className="font-display mb-0 mt-1 text-[21px] font-bold text-[#173744]">{dialog === 'new' ? `Añadir ${meta.singular}` : `Editar ${meta.singular}`}</h2><p className="mb-0 mt-1 text-[11px] text-[#819198]">Los cambios solo afectan a esta demostración.</p></div><button type="button" onClick={()=>setDialog(null)} className="rounded-md p-2 text-[#7b8c92] hover:bg-[#f0f4f5]" aria-label="Cerrar formulario" data-testid={`button-close-form-${collection}`}><X size={17}/></button></div>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{Object.entries(draft).map(([key,value])=><label key={key} className="block"><span className="mb-1.5 block text-[10px] font-semibold capitalize text-[#526a73]">{moduleMeta[collection].columns.find(c=>c.key===key)?.label ?? key.replace(/[A-Z]/g, c=>` ${c.toLowerCase()}`)}</span><input value={value} onChange={e=>setDraft(old=>({...old,[key]:e.target.value}))} required={key!== 'estado'} data-testid={`input-edit-${collection}-${key}`} className="h-10 w-full rounded-lg border border-[#dfe7e9] px-3 text-[11px] text-[#294752] outline-none focus:border-[#63c1bc] focus:ring-2 focus:ring-[#00a9a5]/10"/></label>)}</div>
      <div className="mt-6 flex justify-end gap-2 border-t border-[#edf1f2] pt-4"><button type="button" onClick={()=>setDialog(null)} className="h-9 rounded-lg border border-[#e2e9eb] px-4 text-[11px] font-semibold text-[#64777f] hover:bg-[#f8fafb]" data-testid={`button-cancel-${collection}`}>Cancelar</button><button type="submit" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[11px] font-semibold text-white hover:bg-[#008f8c]" data-testid={`button-save-${collection}`}><Check size={14}/> Guardar cambios</button></div>
    </form></div>}
  </div>;
}

export function SettingsPage() {
  const { reset } = useDemoData();
  const [notice,setNotice] = useState('');
  return <div className="page-enter space-y-6"><div><div className="mb-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#138c88]">Administración / Espacio local</div><h1 className="font-display m-0 text-[32px] font-bold tracking-[-.04em] text-[#102C3A]">Configuración</h1><p className="mb-0 mt-1.5 text-[13px] text-[#71828a]">Preferencias y estado de este entorno de demostración.</p></div>
    {notice && <div className="rounded-lg border border-[#cce9e6] bg-[#eff9f8] px-4 py-3 text-[11px] text-[#167b78]" data-testid="status-reset">{notice}</div>}
    <section className="rounded-xl border border-[#e3eaec] bg-white p-5 sm:p-7"><div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e9f7f5] text-[#148e89]"><ShieldCheck size={19}/></span><div><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Entorno de demostración</h2><p className="mb-0 mt-1 text-[11px] leading-relaxed text-[#75868d]">VÉRTICE TELECOM es una interfaz frontend con datos ficticios para explorar flujos de gestión.</p></div></div>
      <div className="mt-5 rounded-lg border border-[#e9e5d7] bg-[#fcfbf6] p-4"><div className="flex items-center gap-2 text-[11px] font-bold text-[#806b3e]"><CircleAlert size={15}/> Sin conexiones reales</div><p className="mb-0 mt-2 text-[11px] leading-relaxed text-[#786e59]">No hay conexiones reales con operadores ni base de datos activa. Los cambios se almacenan únicamente en el almacenamiento local de este navegador. No se envían datos a terceros.</p></div>
    </section>
    <section className="rounded-xl border border-[#e3eaec] bg-white p-5 sm:p-7"><h2 className="font-display m-0 text-[16px] font-bold text-[#173744]">Datos de demostración</h2><p className="mb-4 mt-1 text-[11px] text-[#819198]">Puedes restaurar la muestra inicial si has modificado registros.</p><button onClick={()=>{if(window.confirm('¿Restaurar todos los registros de demostración a su estado inicial?')){reset();setNotice('La muestra inicial se ha restaurado en este navegador.')}}} className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dfe7e9] px-3 text-[11px] font-semibold text-[#526a73] hover:bg-[#f6f9f9]" data-testid="button-reset-demo"><RotateCcw size={14}/> Restaurar datos de ejemplo</button></section>
  </div>;
}

export function ReportsPage() {
  const { list } = useDemoData();
  const [exported,setExported]=useState(false);
  const rows=[['Módulo','Registros'],...Object.entries({Clientes:list('clientes').length,Ventas:list('ventas').length,Pedidos:list('pedidos').length,'Líneas móviles':list('lineas').length,Fibra:list('fibra').length,Contratos:list('contratos').length,Facturas:list('facturacion').length,Incidencias:list('incidencias').length})];
  const exportCsv=()=>{
    const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(';')).join('\n');
    const url=URL.createObjectURL(new Blob([`\uFEFF${csv}`],{type:'text/csv;charset=utf-8'}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download='vertice-informe-demo.csv';anchor.click();URL.revokeObjectURL(url);setExported(true);window.setTimeout(()=>setExported(false),3000);
  };
  return <div className="page-enter space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#138c88]">Análisis / Actividad</div><h1 className="font-display m-0 text-[32px] font-bold tracking-[-.04em] text-[#102C3A]">Informes</h1><p className="mb-0 mt-1.5 text-[13px] text-[#71828a]">Resumen de actividad basado únicamente en registros ficticios.</p></div><button onClick={exportCsv} data-testid="button-export-report" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dce6e8] bg-white px-3.5 text-[11px] font-semibold text-[#47616b] hover:bg-[#f7fafa]"><ArrowDownToLine size={15}/>{exported?'CSV descargado':'Descargar CSV demo'}</button></div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{[['Ventas registradas',list('ventas').length,'Seguimiento comercial'],['Clientes en muestra',list('clientes').length,'Empresas y particulares'],['Pedidos por gestionar',list('pedidos').filter(p=>p.estado!=='Completado').length,'No completados']].map(([label,value,hint],i)=><div key={label} className="rounded-xl border border-[#e3eaec] bg-white p-5"><p className="m-0 text-[11px] text-[#7e8d93]">{label}</p><strong className="font-display mt-2 block text-[27px] font-bold tracking-[-.04em] text-[#173744]" data-testid={`report-value-${i}`}>{value}</strong><span className="mt-1 block text-[10px] text-[#98a5aa]">{hint} · solo demo</span></div>)}</div>
    <section className="overflow-hidden rounded-xl border border-[#e3eaec] bg-white"><div className="border-b border-[#edf1f2] px-5 py-4"><h2 className="font-display m-0 text-[15px] font-bold text-[#173744]">Volumen por módulo</h2><p className="mb-0 mt-1 text-[10px] text-[#819198]">Conteo actual de registros ficticios almacenados localmente.</p></div><div className="divide-y divide-[#f0f3f4]">{rows.slice(1).map(([name,count])=><div key={name} className="flex items-center gap-4 px-5 py-3.5"><span className="w-36 text-[11px] font-medium text-[#536a73]">{name}</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-[#edf3f4]"><span style={{width:`${Math.max(Number(count)/Math.max(...rows.slice(1).map(r=>Number(r[1])),1)*100,4)}%`}} className="block h-full rounded-full bg-[#00A9A5]"/></div><span className="w-8 text-right text-[11px] font-semibold text-[#294752]" data-testid={`report-count-${String(name).toLowerCase().replaceAll(' ','-')}`}>{count}</span></div>)}</div></section>
    <div className="flex items-start gap-3 rounded-lg border border-[#d9e9e7] bg-[#f1f9f8] p-4"><FilePlus2 size={16} className="mt-0.5 text-[#178d88]"/><p className="m-0 text-[10px] leading-relaxed text-[#55716f]">Este informe no refleja actividad real ni datos de operadores. El CSV descargable se genera en el navegador a partir de la muestra actual.</p></div>
  </div>;
}
