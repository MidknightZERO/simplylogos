import Stripe from 'stripe'

// Server-side only Stripe client - do not import in client components!
// Only create Stripe client on server-side
if (typeof window !== 'undefined') {
  throw new Error('Stripe config should only be imported on the server-side. Import constants from @/lib/stripe/constants instead.')
}

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

// Re-export constants for convenience (server-side only)
export { CREDIT_PACKS, SUBSCRIPTION_TIERS, type CreditPackKey, type SubscriptionTierKey } from './constants'
