import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { supabaseAdmin } from '@/lib/supabase/client'
import { update_user_credits } from '@/lib/supabase/functions'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const metadata = session.metadata || {}
        const { userId, type, tierKey, credits, creditsPerMonth } = metadata

        if (type === 'credit_pack') {
          // Add credits to user account
          await update_user_credits(userId, parseInt(credits))

          // Record transaction
          await supabaseAdmin.from('transactions').insert({
            user_id: userId,
            amount: session.amount_total || 0,
            credits: parseInt(credits),
            type: 'purchase',
            stripe_payment_id: session.payment_intent as string,
            status: 'completed',
          })

          console.log(`Added ${credits} credits to user ${userId}`)
        } else if (type === 'subscription') {
          // Add monthly credits to user account
          await update_user_credits(userId, parseInt(creditsPerMonth))

          // Record subscription
          await supabaseAdmin.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: session.subscription as string,
            tier: tierKey,
            credits_per_month: parseInt(creditsPerMonth),
            active: true,
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          })

          // Record transaction
          await supabaseAdmin.from('transactions').insert({
            user_id: userId,
            amount: session.amount_total || 0,
            credits: parseInt(creditsPerMonth),
            type: 'subscription',
            stripe_subscription_id: session.subscription as string,
            status: 'completed',
          })

          console.log(`Added subscription for user ${userId} with ${creditsPerMonth} credits per month`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const subscriptionId = (invoice as { subscription?: string }).subscription

        if (subscriptionId) {
          // Get subscription details
          const { data: subscription } = await supabaseAdmin
            .from('subscriptions')
            .select('user_id, credits_per_month')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (subscription) {
            // Add monthly credits
            await update_user_credits(subscription.user_id, subscription.credits_per_month)

            // Record transaction
            await supabaseAdmin.from('transactions').insert({
              user_id: subscription.user_id,
              amount: invoice.amount_paid,
              credits: subscription.credits_per_month,
              type: 'subscription',
              stripe_subscription_id: subscriptionId,
              status: 'completed',
            })

            console.log(`Monthly credits added for subscription ${subscriptionId}`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        // Mark subscription as inactive
        await supabaseAdmin
          .from('subscriptions')
          .update({ active: false })
          .eq('stripe_subscription_id', subscription.id)

        console.log(`Subscription ${subscription.id} cancelled`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const subscriptionId = (invoice as { subscription?: string }).subscription

        if (subscriptionId) {
          // Mark subscription as inactive due to payment failure
          await supabaseAdmin
            .from('subscriptions')
            .update({ active: false })
            .eq('stripe_subscription_id', subscriptionId)

          console.log(`Subscription ${subscriptionId} deactivated due to payment failure`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}