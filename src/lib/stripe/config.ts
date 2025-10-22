import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// Credit pack pricing (in pence)
export const CREDIT_PACKS = {
  single: {
    credits: 1,
    price: 500, // £5.00
    stripe_price_id: 'price_single_credit', // Replace with actual Stripe price ID
  },
  small: {
    credits: 10,
    price: 1000, // £10.00
    stripe_price_id: 'price_small_pack', // Replace with actual Stripe price ID
  },
  medium: {
    credits: 100,
    price: 5000, // £50.00
    stripe_price_id: 'price_medium_pack', // Replace with actual Stripe price ID
  },
  large: {
    credits: 1000,
    price: 25000, // £250.00
    stripe_price_id: 'price_large_pack', // Replace with actual Stripe price ID
  },
} as const

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Basic',
    credits_per_month: 10,
    price: 1000, // £10.00/month
    stripe_price_id: 'price_basic_subscription', // Replace with actual Stripe price ID
  },
  pro: {
    name: 'Pro',
    credits_per_month: 100,
    price: 5000, // £50.00/month
    stripe_price_id: 'price_pro_subscription', // Replace with actual Stripe price ID
  },
  enterprise: {
    name: 'Enterprise',
    credits_per_month: 1000,
    price: 25000, // £250.00/month
    stripe_price_id: 'price_enterprise_subscription', // Replace with actual Stripe price ID
  },
} as const

export type CreditPackKey = keyof typeof CREDIT_PACKS
export type SubscriptionTierKey = keyof typeof SUBSCRIPTION_TIERS
