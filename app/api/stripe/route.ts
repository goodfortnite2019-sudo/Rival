import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-server'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

const PLAN_LIMITS: Record<string, { plan: string; limit: number }> = {
  [process.env.STRIPE_PRO_PRICE_ID!]: { plan: 'pro', limit: 5 },
  [process.env.STRIPE_AGENCY_PRICE_ID!]: { plan: 'agency', limit: 15 },
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0].price.id
      const planConfig = PLAN_LIMITS[priceId] || { plan: 'pro', limit: 5 }

      await supabase
        .from('workspaces')
        .update({
          plan: planConfig.plan,
          competitor_limit: planConfig.limit,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
        })
        .eq('owner_id', userId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const priceId = subscription.items.data[0].price.id
      const planConfig = PLAN_LIMITS[priceId] || { plan: 'pro', limit: 5 }

      await supabase
        .from('workspaces')
        .update({ plan: planConfig.plan, competitor_limit: planConfig.limit })
        .eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabase
        .from('workspaces')
        .update({ plan: 'free', competitor_limit: 2, stripe_subscription_id: null })
        .eq('stripe_subscription_id', subscription.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
