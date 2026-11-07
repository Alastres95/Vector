import { useEffect, useRef, useState, type FormEvent, type Ref } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import type { Cliente, EstadoCliente, TipoCliente } from '../../data/demo-data';
import type { ClienteInput } from '../../data/clientes-api';

type Props = {
  client?: Cliente;
  dataMode: 'demo' | 'real';
  onClose: () => void;
  onSave: (input: ClienteInput) => Promise<void>;
};

type Field = keyof ClienteInput;
type Draft = Record<Field, string>;
type FieldErrors = Partial<Record<Field, string>>;

const emptyDraft: Draft = {
  tipo: 'Empresa',
  nombre: '',
  identificadorFiscal: '',
  contacto: '',
  email: '',
  telefono: '',
  direccion: '',
  codigoPostal: '',
  provincia: '',
  observaciones: '',
  comercial: '',
  estado: 'Activo',
};

const fieldClass = (invalid: boolean) =>
  `min-h-11 w-full rounded-lg border bg-white px-3 text-[13px] text-[#294752] outline-none transition focus:border-[#63c1bc] focus:ring-2 focus:ring-[#00a9a5]/10 ${
    invalid ? 'border-[#d88780]' : 'border-[#dfe7e9]'
  }`;

function validate(draft: Draft): { values: ClienteInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const values: ClienteInput = {
    tipo: draft.tipo as TipoCliente,
    nombre: draft.nombre.trim(),
    identificadorFiscal: draft.identificadorFiscal.trim().toUpperCase(),
    contacto: draft.tipo === 'Particular' ? (draft.contacto.trim() || draft.nombre.trim()) : draft.contacto.trim(),
    email: draft.email.trim().toLowerCase(),
    telefono: draft.telefono.trim(),
    direccion: draft.direccion.trim(),
    codigoPostal: draft.codigoPostal.trim(),
    provincia: draft.provincia.trim(),
    observaciones: draft.observaciones.trim(),
    comercial: draft.comercial.trim(),
    estado: draft.estado as EstadoCliente,
  };

  if (!values.nombre) errors.nombre = 'Introduce la razón social o el nombre completo.';
  if (!values.identificadorFiscal) errors.identificadorFiscal = 'El NIF/CIF es obligatorio.';
  else if (!/^[A-Z0-9 .-]{5,20}$/.test(values.identificadorFiscal)) errors.identificadorFiscal = 'Revisa el formato del NIF/CIF.';
  if (draft.tipo === 'Empresa' && !values.contacto) errors.contacto = 'Indica una persona de contacto.';
  if (!values.telefono) errors.telefono = 'El teléfono es obligatorio.';
  else if (!/^[+0-9().\s-]{6,22}$/.test(values.telefono)) errors.telefono = 'Introduce un teléfono válido.';
  if (!values.email) errors.email = 'El correo electrónico es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = 'Introduce un correo electrónico válido.';
  if (!values.direccion) errors.direccion = 'La dirección es obligatoria.';
  if (values.codigoPostal && !/^\d{5}$/.test(values.codigoPostal)) errors.codigoPostal = 'El código postal debe tener cinco dígitos.';
  if (!values.comercial) errors.comercial = 'Asigna un comercial.';

  return { values, errors };
}

export function ClientFormDialog({ client, dataMode, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Draft>(() =>
    client ? Object.fromEntries(Object.keys(emptyDraft).map(key => [key, String(client[key as Field] ?? '')])) as Draft : { ...emptyDraft },
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstField.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const update = (field: Field, value: string) => {
    setDraft(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setSaveError('');
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validate(draft);
    setErrors(result.errors);
    if (Object.keys(result.errors).length) return;

    setSaving(true);
    setSaveError('');
    try {
      await onSave(result.values);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el cliente.';
      setSaveError(error instanceof Error && error.name === '23505' ? 'Ya existe un cliente con ese NIF/CIF en este espacio.' : message);
    } finally {
      setSaving(false);
    }
  };

  const label = (field: Field, text: string, required = false) => (
    <span className="mb-1.5 block text-[11px] font-semibold text-[#526a73]">
      {text}{required && <span className="ml-1 text-[#b85d57]" aria-hidden="true">*</span>}
    </span>
  );

  const input = (field: Field, text: string, options: {
    type?: string; required?: boolean; placeholder?: string; inputMode?: 'text' | 'tel' | 'email' | 'numeric';
    maxLength?: number; ref?: Ref<HTMLInputElement>;
  } = {}) => (
    <label key={field} className="block min-w-0">
      {label(field, text, options.required)}
      <input
        ref={options.ref}
        type={options.type ?? 'text'}
        inputMode={options.inputMode}
        maxLength={options.maxLength}
        value={draft[field]}
        onChange={event => update(field, event.target.value)}
        placeholder={options.placeholder}
        aria-invalid={Boolean(errors[field])}
        aria-describedby={errors[field] ? `client-error-${field}` : undefined}
        autoComplete={field === 'email' ? 'email' : field === 'telefono' ? 'tel' : undefined}
        className={fieldClass(Boolean(errors[field]))}
      />
      {errors[field] && <span id={`client-error-${field}`} className="mt-1 block text-[10px] text-[#b45953]">{errors[field]}</span>}
    </label>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#102c3a]/55 p-2 sm:items-center sm:p-4"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      role="presentation"
      onMouseDown={event => { if (event.target === event.currentTarget && !saving) onClose(); }}
    >
      <form
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-title"
        className="max-h-[calc(100dvh-16px)] w-full max-w-[720px] overflow-y-auto rounded-t-2xl border border-[#dfe8e9] bg-white shadow-2xl shadow-[#102c3a]/20 sm:max-h-[92dvh] sm:rounded-2xl"
        data-testid="form-client"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#edf1f2] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#148e89]">
              {dataMode === 'demo' ? 'Datos de demostración' : 'Registro de cliente'}
            </span>
            <h2 id="client-form-title" className="font-display mb-0 mt-1 text-[21px] font-bold text-[#173744]">
              {client ? 'Editar cliente' : 'Añadir cliente'}
            </h2>
            <p className="mb-0 mt-1 text-[11px] text-[#819198]">
              {dataMode === 'demo' ? 'Este registro se guardará en este navegador.' : 'Los cambios se guardarán en el espacio autorizado.'}
            </p>
          </div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Cerrar formulario" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[#71838b] hover:bg-[#f1f5f6] disabled:opacity-50">
            <X size={19}/>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-7">
          <label className="block">
            {label('tipo', 'Tipo de cliente', true)}
            <select value={draft.tipo} onChange={event => update('tipo', event.target.value)} className={fieldClass(Boolean(errors.tipo))}>
              <option value="Empresa">Empresa</option>
              <option value="Particular">Particular</option>
            </select>
          </label>
          <div className="sm:col-span-1">
            {input('identificadorFiscal', 'NIF/CIF', { required: true, maxLength: 20, placeholder: 'Ej. B-12345678' })}
          </div>
          <div className="sm:col-span-2">
            {input('nombre', draft.tipo === 'Empresa' ? 'Razón social' : 'Nombre completo', { required: true, placeholder: draft.tipo === 'Empresa' ? 'Nombre legal de la empresa' : 'Nombre y apellidos', ref: firstField })}
          </div>
          <div className="sm:col-span-1">
            {input('contacto', 'Nombre del contacto', { required: draft.tipo === 'Empresa' })}
            {draft.tipo === 'Particular' && <p className="mb-0 mt-1 text-[10px] text-[#82939a]">Si se deja vacío, se usará el nombre del cliente.</p>}
          </div>
          {input('telefono', 'Teléfono', { required: true, type: 'tel', inputMode: 'tel', placeholder: '+34 600 000 000' })}
          {input('email', 'Correo electrónico', { required: true, type: 'email', inputMode: 'email', placeholder: 'nombre@empresa.es' })}
          <div className="sm:col-span-2">
            {input('direccion', 'Dirección', { required: true, placeholder: 'Calle, número y planta' })}
          </div>
          {input('codigoPostal', 'Código postal', { inputMode: 'numeric', maxLength: 5, placeholder: '28001' })}
          {input('provincia', 'Provincia', { placeholder: 'Madrid' })}
          {input('comercial', 'Comercial asignado', { required: true, placeholder: 'Nombre del comercial' })}
          <label className="block">
            {label('estado', 'Estado', true)}
            <select value={draft.estado} onChange={event => update('estado', event.target.value)} className={fieldClass(Boolean(errors.estado))}>
              <option value="Activo">Activo</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            {label('observaciones', 'Observaciones')}
            <textarea
              value={draft.observaciones}
              onChange={event => update('observaciones', event.target.value)}
              rows={3}
              maxLength={2000}
              className="min-h-24 w-full resize-y rounded-lg border border-[#dfe7e9] bg-white px-3 py-2.5 text-[13px] text-[#294752] outline-none focus:border-[#63c1bc] focus:ring-2 focus:ring-[#00a9a5]/10"
              placeholder="Notas internas sobre este cliente"
            />
          </label>
          {saveError && <p className="m-0 rounded-lg border border-[#f0d8d5] bg-[#fff6f5] px-3 py-2.5 text-[11px] text-[#a44e48] sm:col-span-2" role="alert">{saveError}</p>}
        </div>

        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-[#edf1f2] bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <button type="button" onClick={onClose} disabled={saving} className="min-h-11 rounded-lg border border-[#e2e9eb] px-4 text-[12px] font-semibold text-[#64777f] hover:bg-[#f8fafb] disabled:opacity-50">Cancelar</button>
          <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#00A9A5] px-4 text-[12px] font-semibold text-white hover:bg-[#008f8c] disabled:cursor-wait disabled:opacity-60" data-testid="button-save-client">
            <Check size={15}/>{saving ? 'Guardando…' : 'Guardar cliente'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
}
