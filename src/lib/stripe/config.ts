import Stripe from 'stripe'

// Debug logging for environment variables
console.log('🔍 ENV DEBUG - Stripe Config Initialization:', {
  hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
  secretKeyPreview: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...',
  nodeEnv: process.env.NODE_ENV,
  isServer: typeof window === 'undefined'
})

const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY is undefined!')
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('STRIPE')))
  throw new Error('STRIPE_SECRET_KEY is not defined. Check Netlify environment variables.')
}

console.log('✅ Stripe environment variables loaded successfully')

export const stripe = new Stripe(stripeSecretKey, {
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
