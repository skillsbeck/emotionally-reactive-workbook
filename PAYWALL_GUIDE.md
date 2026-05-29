# Paywall Setup Guide

This adds paid access to your workbook app. Readers create an account, pay once, and get lifetime access. You can also grant free access to anyone.

---

## Step 1: Stripe Setup

You should already have a Stripe account with a product created (from the instructions above).

### Get your webhook endpoint

After you deploy this update to Netlify, your webhook URL will be:
```
https://YOUR-SITE-NAME.netlify.app/.netlify/functions/stripe-webhook
```

### Register the webhook in Stripe

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **"Add endpoint"**
3. Paste your webhook URL from above
4. Under "Select events to listen to," click **"Select events"**
5. Search for and check: **checkout.session.completed**
6. Click **"Add endpoint"**
7. On the webhook page, click **"Reveal signing secret"** and copy it — this is your `STRIPE_WEBHOOK_SECRET`

---

## Step 2: Supabase Service Key

You need one more key from Supabase that you haven't used yet:

1. Go to **Supabase → Settings → API**
2. Under **"Project API keys"** find the one labeled **service_role** (NOT anon)
3. Copy it — this is your `SUPABASE_SERVICE_KEY`

⚠️ **This key has full database access. Never put it in frontend code. It only goes in Netlify environment variables.**

---

## Step 3: Add All Environment Variables to Netlify

Go to **Netlify → Your Site → Site configuration → Environment variables**

Add ALL of these:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public key |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role key |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys → Secret key |
| `STRIPE_PRICE_ID` | Stripe → Products → click your product → Price ID |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → Signing secret |
| `ADMIN_SECRET` | Make one up — a long random string (use a password generator) |

---

## Step 4: Deploy

```bash
git add .
git commit -m "Added paywall"
git push
```

---

## Step 5: Test the Full Flow

1. Open your app in a private/incognito window
2. Create a new account
3. You should see the paywall screen
4. Click "Get Access" — you'll go to a Stripe test checkout page
5. Use the test card: `4242 4242 4242 4242`, any future date, any CVC
6. After payment, you'll be redirected back and should see the workbook

---

## Granting Free Access

To give someone free access (reviewers, beta testers, friends):

### Option A: Using the terminal (quick)

The person must create an account first (sign up on the app). Then run:

```bash
curl -X POST https://YOUR-SITE.netlify.app/.netlify/functions/grant-access \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_SECRET" \
  -d '{"email": "friend@example.com", "reason": "Beta tester"}'
```

Replace YOUR-SITE and YOUR_ADMIN_SECRET with your actual values.

### Option B: Using the admin page

Open the admin page at your site:
```
https://YOUR-SITE.netlify.app/admin.html
```

Enter the admin secret and the person's email. Click grant.

### Option C: Directly in Supabase

1. Go to **Supabase → Table Editor → user_access**
2. Find the user's row (or create one)
3. Set `has_access` to `true` and `access_type` to `granted`

---

## Going Live (Switch from Test to Production)

When you're ready to take real payments:

1. In Stripe, toggle from "Test mode" to live mode (top-right of dashboard)
2. Create the same product and price in live mode
3. Get new API keys (they start with `sk_live_` and `pk_live_`)
4. Create a new webhook endpoint in live mode with your same URL
5. Update ALL the Stripe environment variables in Netlify with the live values
6. Redeploy

---

## How the Payment Flow Works (Technical)

1. User signs up → account created in Supabase Auth
2. User clicks "Get Access" → frontend calls `create-checkout` function
3. Function creates a Stripe Checkout session with the user's ID in metadata
4. User is redirected to Stripe's hosted checkout page
5. User pays → Stripe sends a webhook to `stripe-webhook` function
6. Function verifies the webhook signature and reads the user ID from metadata
7. Function writes `has_access: true` to the `user_access` table in Supabase
8. User is redirected back to the app → app checks access → workbook loads
