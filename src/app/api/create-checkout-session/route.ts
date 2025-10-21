import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { CREDIT_PACKS, SUBSCRIPTION_TIERS } from '@/lib/stripe/config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, userId, packKey, tierKey } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    if (type === 'credit_pack') {
      if (!packKey || !CREDIT_PACKS[packKey as keyof typeof CREDIT_PACKS]) {
        return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 })
      }

      const pack = CREDIT_PACKS[packKey as keyof typeof CREDIT_PACKS]

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${pack.credits} Credit${pack.credits > 1 ? 's' : ''}`,
                description: `Generate ${pack.credits} logo${pack.credits > 1 ? 's' : ''}`,
              },
              unit_amount: pack.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${request.nextUrl.origin}/dashboard?success=true`,
        cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
        metadata: {
          userId,
          type: 'credit_pack',
          packKey,
          credits: pack.credits.toString(),
        },
      })

      return NextResponse.json({ sessionId: session.id })
    }

    if (type === 'subscription') {
      if (!tierKey || !SUBSCRIPTION_TIERS[tierKey as keyof typeof SUBSCRIPTION_TIERS]) {
        return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 })
      }

      const tier = SUBSCRIPTION_TIERS[tierKey as keyof typeof SUBSCRIPTION_TIERS]

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: `${tier.name} Subscription`,
                description: `${tier.credits_per_month} credits per month`,
              },
              unit_amount: tier.price,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${request.nextUrl.origin}/dashboard?success=true`,
        cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
        metadata: {
          userId,
          type: 'subscription',
          tierKey,
          creditsPerMonth: tier.credits_per_month.toString(),
        },
      })

      return NextResponse.json({ sessionId: session.id })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
