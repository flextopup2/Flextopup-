import { FormEvent, useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

type Order = { id: string; reference: string; amount_kobo: number; status: string; created_at: string };
type Wallet = { balance_kobo: number };
const naira = (kobo: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(kobo / 100);

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [amount, setAmount] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    if (!session?.user) return;
    const [walletResult, orderResult] = await Promise.all([
      supabase.from('wallets').select('balance_kobo').eq('user_id', session.user.id).maybeSingle(),
      supabase.from('orders').select('id,reference,amount_kobo,status,created_at').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(25),
    ]);
    if (walletResult.error) setMessage(walletResult.error.message); else setWallet(walletResult.data);
    if (orderResult.error) setMessage(orderResult.error.message); else setOrders(orderResult.data ?? []);
  }, [session]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function submitEmailAuth(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const result = mode === 'register'
        ? await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName, phone } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (mode === 'register' && !result.data.session) setMessage('Account created. Check your email to confirm, then sign in.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Authentication failed.'); }
    finally { setBusy(false); }
  }

  async function sendPhoneCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;
      setPhoneOtpSent(true); setMessage('Verification code sent by SMS.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send code.'); }
    finally { setBusy(false); }
  }

  async function verifyPhoneCode(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) throw error;
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Code verification failed.'); }
    finally { setBusy(false); }
  }

  async function fundWallet(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('');
    const nairaAmount = Number(amount);
    if (!Number.isFinite(nairaAmount) || nairaAmount < 100 || nairaAmount > 50000) {
      setMessage('Enter an amount between ₦100 and ₦50,000.'); setBusy(false); return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('create-paystack-checkout', {
        body: { amountKobo: Math.round(nairaAmount * 100), email: checkoutEmail || session?.user.email },
      });
      if (error) throw error;
      if (!data?.authorizationUrl) throw new Error('Checkout URL was not returned.');
      window.location.assign(data.authorizationUrl);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not start checkout.'); setBusy(false); }
  }

  async function signOut() { await supabase.auth.signOut(); setWallet(null); setOrders([]); }

  if (loading) return <main className="shell"><p>Loading FlexTopUp…</p></main>;

  return <main className="shell">
    <header className="top"><div className="brand"><span className="bolt">⚡</span><div><h1>FlexTopUp</h1><p>Wallet & payments</p></div></div>{session && <button className="quiet" onClick={signOut}>Sign out</button>}</header>
    {message && <div className="notice" role="status">{message}</div>}
    {!session ? <section className="panel auth">
      <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
      <p className="muted">Sign in with email, or receive a one-time code by phone.</p>
      <form onSubmit={submitEmailAuth} className="stack">
        {mode === 'register' && <><label>Full name<input value={displayName} onChange={e => setDisplayName(e.target.value)} required autoComplete="name" /></label><label>Phone number<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234…" autoComplete="tel" /></label></>}
        <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        <button className="primary" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
      </form>
      <button className="link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}>{mode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}</button>
      <div className="divider"><span>or phone verification</span></div>
      <form onSubmit={phoneOtpSent ? verifyPhoneCode : sendPhoneCode} className="stack">
        <label>Phone number<input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234…" type="tel" required /></label>
        {phoneOtpSent && <label>SMS code<input value={otp} onChange={e => setOtp(e.target.value)} inputMode="numeric" autoComplete="one-time-code" required /></label>}
        <button className="secondary" disabled={busy}>{phoneOtpSent ? 'Verify code' : 'Send SMS code'}</button>
      </form>
      <p className="footnote">Phone login requires an SMS provider and phone auth enabled in Supabase.</p>
    </section> : <>
      <section className="balance"><div><span className="muted">Available wallet balance</span><strong>{naira(wallet?.balance_kobo ?? 0)}</strong></div><span className="walletIcon">₦</span></section>
      <section className="panel"><h2>Fund your wallet</h2><p className="muted">Secure payment powered by Paystack.</p>
        <form className="stack" onSubmit={fundWallet}><label>Amount (₦)<input type="number" min="100" max="50000" step="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 1000" required /></label>
          {!session.user.email && <label>Email for Paystack receipt<input type="email" value={checkoutEmail} onChange={e => setCheckoutEmail(e.target.value)} required /></label>}
          <button className="primary" disabled={busy}>{busy ? 'Starting secure checkout…' : 'Continue to Paystack'}</button></form>
      </section>
      <section className="panel"><div className="row"><div><h2>Recent orders</h2><p className="muted">Payment status updates after webhook confirmation.</p></div><button className="quiet" onClick={() => void refresh()}>Refresh</button></div>
        {orders.length === 0 ? <p className="empty">No wallet orders yet.</p> : <div className="orders">{orders.map(order => <article className="order" key={order.id}><div><strong>{naira(order.amount_kobo)}</strong><small>{new Date(order.created_at).toLocaleString()}</small><code>{order.reference}</code></div><span className={`status ${order.status}`}>{order.status}</span></article>)}</div>}
      </section>
    </>}
    <footer>Payments are confirmed by Paystack’s signed server-side webhook.</footer>
  </main>;
}
