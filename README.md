# Rival — Deploy Guide

**Competitor Intelligence, Automated.** Weekly AI briefings on what your competitors are doing.

---

## What you need (all free to start)

| Service | Cost | What for |
|---|---|---|
| [Vercel](https://vercel.com) | Free | Hosting + Cron jobs |
| [Supabase](https://supabase.com) | Free | Database + Auth |
| [Anthropic](https://console.anthropic.com) | Pay-per-use (~$0.05/report) | AI analysis |
| [Resend](https://resend.com) | Free (100 emails/day) | Weekly briefings |
| [Stripe](https://stripe.com) | Free + 2.9% per transaction | Payments |
| Domain | ~€12/year | Your brand |

---

## Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon key** (Settings → API)
3. Copy your **service_role key** (Settings → API → Service role — keep this secret!)
4. Go to SQL Editor → paste the entire contents of `supabase/schema.sql` → Run

---

## Step 2 — Set up Resend

1. Go to [resend.com](https://resend.com) → Create account
2. Add your domain (or use their free `@resend.dev` address to start)
3. Copy your **API key**

---

## Step 3 — Set up Stripe

1. Go to [stripe.com](https://stripe.com) → Create account
2. Create two products in the Stripe dashboard:
   - **Rival Pro** — €29/month recurring → copy the **Price ID** (starts with `price_`)
   - **Rival Agency** — €79/month recurring → copy the **Price ID**
3. Copy your **Publishable key** and **Secret key** (Developers → API Keys)
4. Set up webhook: Developers → Webhooks → Add endpoint
   - URL: `https://yourdomain.com/api/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Webhook signing secret**

---

## Step 4 — Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project → select your repo
3. Add all environment variables (from `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

ANTHROPIC_API_KEY=sk-ant-xxx...

STRIPE_SECRET_KEY=sk_live_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...
STRIPE_PRO_PRICE_ID=price_xxx...
STRIPE_AGENCY_PRICE_ID=price_xxx...

RESEND_API_KEY=re_xxx...
EMAIL_FROM=briefings@yourdomain.com

NEXT_PUBLIC_APP_URL=https://yourdomain.com
CRON_SECRET=generate-a-random-64-char-string-here
```

4. Click **Deploy** — Vercel builds and deploys automatically

---

## Step 5 — Verify cron job

The cron job runs every Monday at 7:00 AM UTC (configured in `vercel.json`).

To test it manually after deploy:
```bash
curl -X GET https://yourdomain.com/api/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

You should see `{"success":true,"processed":N}`.

---

## Step 6 — Connect your domain

1. In Vercel → your project → Settings → Domains → add your domain
2. Update your DNS records as Vercel instructs
3. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars to your real domain

---

## AppSumo Launch

When you're ready to list on AppSumo:

1. Go to [sell.appsumo.com](https://sell.appsumo.com) → Apply as a seller
2. Your pitch: "Rival monitors up to 25 competitors automatically, scans 6 page types weekly, and sends a Claude-powered intelligence briefing every Monday. No manual work. LTD: unlimited competitors for life."
3. AppSumo handles all payments. You receive 70% of each sale after the first $500 (which goes entirely to you).
4. For LTD buyers: manually set their workspace `plan` to `agency` in Supabase after purchase, or build a redemption code flow.

**Suggested AppSumo pricing:**
- Tier 1: $49 — 5 competitors, weekly reports
- Tier 2: $99 — 15 competitors, weekly reports + email
- Tier 3: $149 — 25 competitors, all features

---

## File structure

```
Rival/
├── app/
│   ├── page.tsx                    ← Landing page
│   ├── layout.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx                ← Main dashboard
│   │   ├── competitors/add/page.tsx
│   │   ├── reports/[id]/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── cron/route.ts           ← Weekly job (Vercel Cron)
│       ├── scan/route.ts           ← Manual scan trigger
│       ├── checkout/route.ts       ← Stripe checkout
│       └── stripe/route.ts         ← Stripe webhook
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   ├── scraper.ts
│   ├── anthropic.ts
│   └── mailer.ts
├── supabase/
│   └── schema.sql
├── types/index.ts
├── middleware.ts
├── vercel.json                     ← Cron schedule
└── .env.example
```

---

## Cost at scale

| Users | Claude cost | Resend | Total/month |
|---|---|---|---|
| 10 | ~$0.50 | Free | ~$0.50 |
| 100 | ~$5 | Free | ~$5 |
| 1,000 | ~$50 | ~$20 | ~$70 |

At 1,000 Pro users ($29/month each) → **$29,000 MRR** with ~$70 in AI/email costs. 99.7% margin on variable costs.
