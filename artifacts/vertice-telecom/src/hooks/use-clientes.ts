import { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { useDemoData } from '../data/DemoProvider';
import {
  archiveSupabaseCliente,
  createSupabaseCliente,
  listSupabaseClientes,
  updateSupabaseCliente,
  type ClienteInput,
} from '../data/clientes-api';
import type { Cliente } from '../data/demo-data';
import { supabase, supabaseConfigured } from '../lib/supabase';

type Source = 'demo' | 'real';

const localDate = () =>
  new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());

const fiscalKey = (value: string) => value.toLocaleUpperCase('es').replace(/[\s.-]/g, '');

export function useClientes(source: Source, user: User | null) {
  const demoRepo = useDemoData();
  const [remoteRecords, setRemoteRecords] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(source === 'real' && supabaseConfigured && Boolean(user));
  const [error, setError] = useState('');
  const organizationId = String(user?.app_metadata.organization_id ?? user?.id ?? '');
  const records = source === 'real' ? remoteRecords : demoRepo.list('clientes');

  useEffect(() => {
    let active = true;
    setRemoteRecords([]);
    setError('');

    if (source !== 'real' || !supabaseConfigured || !supabase || !user) {
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    void listSupabaseClientes(supabase)
      .then(rows => { if (active) setRemoteRecords(rows); })
      .catch(reason => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'No se pudieron cargar los clientes.');
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [source, user?.id, organizationId]);

  const canManage = useMemo(() => {
    if (source === 'demo') return true;
    const role = String(user?.app_metadata.role ?? '').toLocaleLowerCase('es');
    return ['superadministrador', 'administrador', 'comercial'].includes(role);
  }, [source, user?.app_metadata.role]);

  const save = useCallback(async (input: ClienteInput, existing?: Cliente) => {
    const duplicate = records.find(row =>
      row.id !== existing?.id && fiscalKey(row.identificadorFiscal) === fiscalKey(input.identificadorFiscal),
    );
    if (duplicate) throw new Error('Ya existe un cliente con ese NIF/CIF en este espacio.');

    if (source === 'demo') {
      if (existing) {
        demoRepo.update('clientes', existing.id, input);
        return { ...existing, ...input };
      }
      const created: Cliente = {
        ...input,
        id: `CLI-${Date.now().toString(36).toUpperCase()}`,
        fechaAlta: localDate(),
      };
      demoRepo.create('clientes', created);
      return created;
    }

    if (!supabase || !user) throw new Error('Inicia sesión antes de guardar clientes reales.');
    const saved = existing
      ? await updateSupabaseCliente(supabase, existing.id, input)
      : await createSupabaseCliente(supabase, user, input);
    setRemoteRecords(previous => existing
      ? previous.map(row => row.id === saved.id ? saved : row)
      : [saved, ...previous]);
    setError('');
    return saved;
  }, [demoRepo, records, source, user]);

  const archive = useCallback(async (client: Cliente) => {
    if (source === 'demo') {
      demoRepo.remove('clientes', client.id);
      return;
    }
    if (!supabase) throw new Error('Supabase no está configurado.');
    await archiveSupabaseCliente(supabase, client.id);
    setRemoteRecords(previous => previous.map(row =>
      row.id === client.id ? { ...row, estado: 'Inactivo' } : row,
    ));
  }, [demoRepo, source]);

  const byId = useCallback((id: string) => records.find(row => row.id === id) ?? null, [records]);

  return { records, loading, error, setError, canManage, save, archive, byId };
}
