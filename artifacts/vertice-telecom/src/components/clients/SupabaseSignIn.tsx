import { useState, type FormEvent } from 'react';
import { KeyRound, LockKeyhole, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function SupabaseSignIn({ onViewDemo }: { onViewDemo: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) setError('No se pudo iniciar sesión. Comprueba el correo, la contraseña y la configuración de Supabase Auth.');
    setBusy(false);
  };

  return <section className="mx-auto w-full max-w-[520px] rounded-2xl border border-[#dfe8e9] bg-white p-5 shadow-sm sm:p-7" aria-labelledby="clients-sign-in-title">
    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e9f7f5] text-[#148e89]"><KeyRound size={20}/></div>
    <span className="text-[9px] font-bold uppercase tracking-[.14em] text-[#148e89]">Acceso protegido</span>
    <h2 id="clients-sign-in-title" className="font-display mb-0 mt-1 text-[20px] font-bold text-[#173744]">Inicia sesión para ver clientes reales</h2>
    <p className="mb-0 mt-2 text-[12px] leading-relaxed text-[#71838a]">El acceso se valida con Supabase Auth y las políticas RLS de la organización. No se cargan datos reales sin una sesión.</p>
    <form onSubmit={signIn} className="mt-5 space-y-4" noValidate>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold text-[#526a73]">Correo electrónico</span>
        <span className="relative block"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a0a5]"/><input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#dfe7e9] pl-9 pr-3 text-[13px] text-[#294752] outline-none focus:border-[#63c1bc] focus:ring-2 focus:ring-[#00a9a5]/10" /></span>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold text-[#526a73]">Contraseña</span>
        <span className="relative block"><LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91a0a5]"/><input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="min-h-11 w-full rounded-lg border border-[#dfe7e9] pl-9 pr-3 text-[13px] text-[#294752] outline-none focus:border-[#63c1bc] focus:ring-2 focus:ring-[#00a9a5]/10" /></span>
      </label>
      {error && <p className="m-0 rounded-lg border border-[#f0d8d5] bg-[#fff6f5] px-3 py-2.5 text-[11px] text-[#a44e48]" role="alert">{error}</p>}
      <button type="submit" disabled={busy || !email.trim() || !password} className="min-h-11 w-full rounded-lg bg-[#00A9A5] px-4 text-[12px] font-semibold text-white hover:bg-[#008f8c] disabled:cursor-not-allowed disabled:opacity-60">
        {busy ? 'Comprobando acceso…' : 'Iniciar sesión'}
      </button>
    </form>
    <button type="button" onClick={onViewDemo} className="mt-4 min-h-11 w-full rounded-lg border border-[#e2e9eb] px-4 text-[11px] font-semibold text-[#526a73] hover:bg-[#f8fafb]">Ver los seis clientes de demostración</button>
  </section>;
}
