'use client'

import { useUser } from '@/hooks/useUser'
import LogoRotation from '@/components/LogoRotation'
import Link from 'next/link'
import { CREDIT_PACKS, SUBSCRIPTION_TIERS } from '@/lib/stripe/constants'

export default function PricingPage() {
  const { user } = useUser()
  // const [selectedPack, setSelectedPack] = useState<keyof typeof CREDIT_PACKS>('small')
  // const [selectedSubscription, setSelectedSubscription] = useState<keyof typeof SUBSCRIPTION_TIERS>('basic')

  const handleCreditPurchase = async (packKey: keyof typeof CREDIT_PACKS) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'credit_pack',
          userId: user.id,
          packKey,
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        // Redirect to Stripe Checkout
        const { loadStripe } = await import('@stripe/stripe-js')
        // Debug logging for Stripe publishable key
        console.log('🔍 ENV DEBUG - Stripe Publishable Key:', {
          hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          keyPreview: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...',
          isClient: typeof window !== 'undefined'
        })

        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is undefined!')
          throw new Error('Stripe publishable key not configured')
        }

        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        if (stripeInstance) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (stripeInstance as any).redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  const handleSubscriptionPurchase = async (tierKey: keyof typeof SUBSCRIPTION_TIERS) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'subscription',
          userId: user.id,
          tierKey,
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        // Redirect to Stripe Checkout
        const { loadStripe } = await import('@stripe/stripe-js')
        // Debug logging for Stripe publishable key
        console.log('🔍 ENV DEBUG - Stripe Publishable Key:', {
          hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          keyPreview: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...',
          isClient: typeof window !== 'undefined'
        })

        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          console.error('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is undefined!')
          throw new Error('Stripe publishable key not configured')
        }

        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
        if (stripeInstance) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (stripeInstance as any).redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#e7e7e7]">
      {/* Header */}
      <header className="bg-[#e7e7e7] shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/">
                <LogoRotation />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Generate Logo
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that works best for your logo generation needs
          </p>
        </div>

        {/* Credit Packs */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Credit Packs - Pay As You Go
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(CREDIT_PACKS).map(([key, pack]) => (
              <div
                key={key}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pack.credits} Credit{pack.credits > 1 ? 's' : ''}
                  </h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      £{(pack.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    £{(pack.price / pack.credits / 100).toFixed(2)} per logo
                  </p>
                  {pack.credits > 1 && (
                    <p className="mt-1 text-sm text-green-600 font-medium">
                      Save {Math.round((1 - pack.price / (pack.credits * 500)) * 100)}%
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => handleCreditPurchase(key as keyof typeof CREDIT_PACKS)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscriptions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Monthly Subscriptions - Best Value
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
              <div
                key={key}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                {key === 'pro' && (
                  <div className="text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      £{(tier.price / 100).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-600">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {tier.credits_per_month} credits per month
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    £{(tier.price / tier.credits_per_month / 100).toFixed(2)} per logo
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => handleSubscriptionPurchase(key as keyof typeof SUBSCRIPTION_TIERS)}
                    className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      key === 'pro'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                        : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
                    }`}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  What&apos;s included with each credit?
                </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Each credit allows you to generate one logo. You&apos;ll receive a high-quality PNG file that you can download and use for your business.
                  </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Do credits expire?
                </h3>
                <p className="mt-2 text-gray-600">
                  Credits purchased through credit packs never expire. Subscription credits reset monthly.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Can I cancel my subscription?
                </h3>
                <p className="mt-2 text-gray-600">
                  Yes, you can cancel your subscription at any time. You&apos;ll continue to have access to your remaining credits until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  What file formats do you provide?
                </h3>
                <p className="mt-2 text-gray-600">
                  Currently, we provide PNG files. SVG format will be available as a premium feature in the future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
