import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Cliente, EstadoCliente, TipoCliente } from './demo-data';

export type ClienteInput = Omit<Cliente, 'id' | 'fechaAlta'>;

type ClienteRow = {
  id: string;
  tipo_cliente: TipoCliente;
  nombre: string;
  nif_cif: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  comercial: string;
  estado: EstadoCliente;
  created_at: string;
};

const organizationIdFor = (user: User) => {
  const candidate = user.app_metadata.organization_id;
  return typeof candidate === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)
    ? candidate
    : user.id;
};

const mapRow = (row: ClienteRow): Cliente => ({
  id: row.id,
  tipo: row.tipo_cliente,
  nombre: row.nombre,
  identificadorFiscal: row.nif_cif,
  contacto: row.nombre_contacto,
  email: row.email,
  telefono: row.telefono,
  direccion: row.direccion,
  comercial: row.comercial,
  estado: row.estado,
  fechaAlta: row.created_at
    ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(row.created_at))
    : '',
});

const toRow = (input: ClienteInput) => ({
  tipo_cliente: input.tipo,
  nombre: input.nombre.trim(),
  nif_cif: input.identificadorFiscal.trim().toUpperCase(),
  nombre_contacto: input.contacto.trim(),
  email: input.email.trim().toLowerCase(),
  telefono: input.telefono.trim(),
  direccion: input.direccion.trim(),
  comercial: input.comercial.trim(),
  estado: input.estado,
});

const throwIfError = (error: { message: string } | null) => {
  if (error) throw new Error(error.message);
};

export async function listSupabaseClientes(client: SupabaseClient): Promise<Cliente[]> {
  const { data, error } = await client
    .from('clientes')
    .select('id,tipo_cliente,nombre,nif_cif,nombre_contacto,email,telefono,direccion,comercial,estado,created_at')
    .order('created_at', { ascending: false });
  throwIfError(error);
  return ((data ?? []) as ClienteRow[]).map(mapRow);
}

export async function getSupabaseCliente(client: SupabaseClient, id: string): Promise<Cliente | null> {
  const { data, error } = await client
    .from('clientes')
    .select('id,tipo_cliente,nombre,nif_cif,nombre_contacto,email,telefono,direccion,comercial,estado,created_at')
    .eq('id', id)
    .maybeSingle();
  throwIfError(error);
  return data ? mapRow(data as ClienteRow) : null;
}

export async function createSupabaseCliente(
  client: SupabaseClient,
  user: User,
  input: ClienteInput,
): Promise<Cliente> {
  const { data, error } = await client
    .from('clientes')
    .insert({
      ...toRow(input),
      organization_id: organizationIdFor(user),
      created_by: user.id,
    })
    .select('id,tipo_cliente,nombre,nif_cif,nombre_contacto,email,telefono,direccion,comercial,estado,created_at')
    .single();
  throwIfError(error);
  return mapRow(data as ClienteRow);
}

export async function updateSupabaseCliente(
  client: SupabaseClient,
  id: string,
  input: ClienteInput,
): Promise<Cliente> {
  const { data, error } = await client
    .from('clientes')
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id,tipo_cliente,nombre,nif_cif,nombre_contacto,email,telefono,direccion,comercial,estado,created_at')
    .single();
  throwIfError(error);
  return mapRow(data as ClienteRow);
}

export async function deleteSupabaseCliente(client: SupabaseClient, id: string): Promise<void> {
  const { data, error } = await client.from('clientes').delete().eq('id', id).select('id').maybeSingle();
  throwIfError(error);
  if (!data) throw new Error('El cliente no existe o no está disponible para este usuario.');
}
