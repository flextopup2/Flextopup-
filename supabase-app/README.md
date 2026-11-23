# Supabase web app setup

This folder adds a React + Vite + TypeScript client without overwriting the existing static `index.html` and `admin.html` at the repository root.

## Run locally

```sh
cd supabase-app
cp .env.example .env.local
# Set VITE_SUPABASE_PUBLISHABLE_KEY in .env.local
npm install
npm run dev
```

The Supabase URL is configured for the supplied project. The publishable key is intentionally a local environment value and is not committed. Vite only exposes variables prefixed with `VITE_`; never put a Supabase service-role key or a Paystack secret in these variables or browser code.

## Configure Supabase

1. Run `supabase/migrations/202611230001_wallet_payments.sql` in the Supabase SQL Editor.
2. In Authentication settings, enable Email/password. Configure your SMTP and email-confirmation behavior as desired.
3. For phone OTP, enable Phone auth and configure an SMS provider. Phone numbers must use international format, e.g. `+234...`.
4. Deploy the two Edge Functions from this directory using the Supabase CLI (see commands below). Set secrets before deployment:

```sh
supabase secrets set PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET
supabase functions deploy create-paystack-checkout --no-verify-jwt=false
supabase functions deploy paystack-webhook --no-verify-jwt
```

The checkout function verifies the caller's Supabase access token itself. The webhook intentionally does not use Supabase JWT verification; it validates Paystack's `x-paystack-signature` HMAC-SHA512 against the raw request body instead.

5. In Paystack dashboard, configure the webhook URL as `https://wdcfwrjqlhkhnolinpjr.supabase.co/functions/v1/paystack-webhook`.
6. Configure secrets in Supabase Edge Functions; Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never add the service-role key to the frontend.

The app calls `create-paystack-checkout`, which creates the pending order server-side and initializes Paystack Checkout. Wallet credits and successful transactions are created only after the signed `charge.success` webhook. A database function uses row locking and unique constraints so retries cannot credit the same order twice. Authenticated users can only read their own profile, wallet, orders, and transactions; the browser has no write policy for payment records or wallet balances.

## Deploying the web app

Build with `npm run build`; publish `supabase-app/dist` from your hosting provider. The existing root static site is unchanged in this branch, so this sub-app needs its own build/publish configuration to replace or be served alongside the old site.
