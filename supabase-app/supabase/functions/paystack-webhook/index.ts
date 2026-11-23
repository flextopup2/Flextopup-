import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!secret || !url || !serviceKey) return Response.json({ error: 'Webhook configuration is missing.' }, { status: 500, headers: corsHeaders });

  const rawBody = await req.arrayBuffer();
  const signature = req.headers.get('x-paystack-signature') ?? '';
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, rawBody));
  const expectedHex = [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  if (!equalBytes(new TextEncoder().encode(signature.toLowerCase()), new TextEncoder().encode(expectedHex))) {
    return Response.json({ error: 'Invalid signature.' }, { status: 401, headers: corsHeaders });
  }

  try {
    const event = JSON.parse(new TextDecoder().decode(rawBody));
    if (event?.event !== 'charge.success') return Response.json({ received: true }, { headers: corsHeaders });
    const data = event.data;
    if (!data?.reference || data.status !== 'success' || data.currency !== 'NGN' || !Number.isSafeInteger(data.amount)) {
      return Response.json({ error: 'Payment data is invalid.' }, { status: 400, headers: corsHeaders });
    }
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data: order, error: lookupError } = await admin.from('orders').select('amount_kobo,status').eq('reference', data.reference).maybeSingle();
    if (lookupError) throw lookupError;
    if (!order) return Response.json({ error: 'Order not found.' }, { status: 404, headers: corsHeaders });
    if (order.amount_kobo !== data.amount || order.status === 'failed') return Response.json({ error: 'Payment does not match pending order.' }, { status: 400, headers: corsHeaders });
    const { data: finalized, error } = await admin.rpc('finalize_paystack_order', { p_reference: data.reference });
    if (error) throw error;
    if (!finalized) return Response.json({ error: 'Order could not be finalized.' }, { status: 409, headers: corsHeaders });
    return Response.json({ received: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('paystack-webhook:', error);
    return Response.json({ error: 'Webhook processing failed.' }, { status: 500, headers: corsHeaders });
  }
});
