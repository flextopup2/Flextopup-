import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
  const authorization = req.headers.get('Authorization');
  if (!supabaseUrl || !anonKey || !serviceKey || !paystackSecret || !authorization) {
    return Response.json({ error: 'Server configuration or authorization is missing.' }, { status: 500, headers: corsHeaders });
  }

  try {
    const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } }, auth: { persistSession: false } });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return Response.json({ error: 'Sign in is required.' }, { status: 401, headers: corsHeaders });

    const body = await req.json();
    const amountKobo = body?.amountKobo;
    const email = String(body?.email ?? user.email ?? '').trim();
    if (!Number.isSafeInteger(amountKobo) || amountKobo < 10000 || amountKobo > 5000000) {
      return Response.json({ error: 'Amount must be between ₦100 and ₦50,000.' }, { status: 400, headers: corsHeaders });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'A valid email is required for Paystack.' }, { status: 400, headers: corsHeaders });

    const reference = `ft_${crypto.randomUUID().replaceAll('-', '')}`;
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { error: insertError } = await admin.from('orders').insert({ user_id: user.id, reference, amount_kobo: amountKobo, currency: 'NGN', status: 'pending' });
    if (insertError) throw insertError;

    const payment = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${paystackSecret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, amount: amountKobo, reference, currency: 'NGN', metadata: { user_id: user.id, order_reference: reference } }),
    });
    const result = await payment.json();
    if (!payment.ok || !result.status || !result.data?.authorization_url) {
      await admin.from('orders').update({ status: 'failed' }).eq('reference', reference).eq('user_id', user.id);
      return Response.json({ error: 'Paystack could not initialize checkout.' }, { status: 502, headers: corsHeaders });
    }
    return Response.json({ authorizationUrl: result.data.authorization_url, reference }, { headers: corsHeaders });
  } catch (error) {
    console.error('create-paystack-checkout:', error);
    return Response.json({ error: 'Could not create checkout.' }, { status: 500, headers: corsHeaders });
  }
});
