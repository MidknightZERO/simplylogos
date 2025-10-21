'use client'

import { useUser } from '@/hooks/useUser'
import LogoGenerator from '@/components/LogoGenerator'
import HeroSection from '@/components/HeroSection'
import LogoRotation from '@/components/LogoRotation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function HomePage() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content */}
        <main className="relative z-10">
          {/* How It Works Section */}
          <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  How It Works
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Create professional logos in three simple steps
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full">
                    <span className="text-2xl font-bold text-indigo-600">1</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Describe your business</h3>
                  <p className="mt-2 text-gray-600">
                    Tell us about your business name, industry, and any specific elements you&apos;d like in your logo.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full">
                    <span className="text-2xl font-bold text-indigo-600">2</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">AI generates your logo</h3>
                  <p className="mt-2 text-gray-600">
                    Our advanced AI creates a professional, unique logo tailored to your business needs.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full">
                    <span className="text-2xl font-bold text-indigo-600">3</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Download in PNG format</h3>
                  <p className="mt-2 text-gray-600">
                    Get your high-quality logo ready for immediate use across all your marketing materials.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Features
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Everything you need for professional logos
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">Lightning Fast</h3>
                  <p className="mt-2 text-gray-600">
                    Generate professional logos in seconds, not hours.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">High Quality</h3>
                  <p className="mt-2 text-gray-600">
                    Professional-grade logos suitable for any business use.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">Affordable</h3>
                  <p className="mt-2 text-gray-600">
                    Starting from just £5 per logo generation.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">Easy to Use</h3>
                  <p className="mt-2 text-gray-600">
                    Simple interface that anyone can use to create amazing logos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to create your logo?
              </h2>
              <p className="mt-4 text-xl text-indigo-100">
                Join thousands of businesses who trust SimplyLogos for their branding needs.
              </p>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200 hover:scale-105"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo Rotation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <LogoRotation />
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.href = '/'
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <LogoGenerator />
        </div>
      </main>
    </div>
  )
}