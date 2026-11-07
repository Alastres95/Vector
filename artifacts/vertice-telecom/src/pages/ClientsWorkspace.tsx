import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { CircleAlert } from 'lucide-react';
import { supabaseConfigured } from '../lib/supabase';
import { ClientsPage, ClientDetailPage } from './Clients';
import { SupabaseClientDetailPage, SupabaseClientsPage } from './ClientsSupabase';

export function ClientsWorkspace() {
  const [location, navigate] = useLocation();
  const query = typeof window === 'undefined' ? '' : window.location.search;
  const requestedSource = new URLSearchParams(query).get('origen');
  const [source, setSource] = useState<'demo' | 'real'>(() => supabaseConfigured && requestedSource === 'real' ? 'real' : 'demo');
  const isDetail = location.split('?')[0].startsWith('/clientes/');

  useEffect(() => {
    setSource(supabaseConfigured && new URLSearchParams(query).get('origen') === 'real' ? 'real' : 'demo');
  }, [location, query]);

  const chooseSource = (next: 'demo' | 'real') => {
    setSource(next);
    window.dispatchEvent(new CustomEvent('vertice-client-source-change', { detail: next }));
    navigate(`/clientes?origen=${next}`);
  };

  return <div className="space-y-4">
    {supabaseConfigured && <div className="flex gap-2 rounded-xl border border-[#e3eaec] bg-white p-1.5" role="tablist" aria-label="Origen de los clientes">
      <button type="button" role="tab" aria-selected={source === 'real'} onClick={() => chooseSource('real')} className={`min-h-11 flex-1 rounded-lg px-3 text-[11px] font-semibold transition ${source === 'real' ? 'bg-[#102C3A] text-white' : 'text-[#60757e] hover:bg-[#f4f7f8]'}`}>Clientes reales</button>
      <button type="button" role="tab" aria-selected={source === 'demo'} onClick={() => chooseSource('demo')} className={`min-h-11 flex-1 rounded-lg px-3 text-[11px] font-semibold transition ${source === 'demo' ? 'bg-[#e9f7f5] text-[#147d79]' : 'text-[#60757e] hover:bg-[#f4f7f8]'}`}>Datos de demostración</button>
    </div>}

    {!supabaseConfigured && <div className="flex items-start gap-2.5 rounded-xl border border-[#e6e9dd] bg-[#fcfbf5] px-4 py-3 text-[10px] leading-relaxed text-[#786b4e]" role="status">
      <CircleAlert size={15} className="mt-0.5 shrink-0"/><span>Conexión de Supabase pendiente: faltan `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Esta vista conserva los seis clientes ficticios y no guarda clientes reales.</span>
    </div>}

    {source === 'real'
      ? isDetail ? <SupabaseClientDetailPage onViewDemo={() => chooseSource('demo')}/> : <SupabaseClientsPage onViewDemo={() => chooseSource('demo')}/>
      : isDetail ? <ClientDetailPage/> : <ClientsPage/>}

  </div>;
}
