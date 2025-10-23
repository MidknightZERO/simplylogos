'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import LogoGenerator from '@/components/LogoGenerator'
import HeroSection from '@/components/HeroSection'
import StickyHeader from '@/components/StickyHeader'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import Footer from '@/components/Footer'
import LogoRotation from '@/components/LogoRotation'
import UserMenu from '@/components/UserMenu'
import ParticleBackground from '@/components/ParticleBackground'
import Link from 'next/link'

export default function HomePage() {
  const { user, loading } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Sticky Header */}
        <StickyHeader isVisible={isScrolled} />
        
        {/* Scroll to Top Button */}
        <ScrollToTopButton />
        
        {/* Hero Section */}
        <HeroSection onScrollStateChange={setIsScrolled} />

        {/* Main Content */}
        <main className="relative z-10">
          {/* How It Works Section */}
          <div className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                  How It Works
                </h2>
                <p className="mt-4 text-xl text-slate-600">
                  Create professional logos in three simple steps
                </p>
              </div>
              
              <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-3">
                <div className="text-center group">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    <svg className="w-12 h-12 text-white group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Text</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Enter the text you want on your logo. Your business name, tagline, or any text that represents your brand.
                  </p>
                </div>
                
                <div className="text-center group">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    <svg className="w-12 h-12 text-white group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Elements</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Describe the elements you&apos;d like in your logo. Colors, shapes, icons, or any specific design elements that represent your business.
                  </p>
                </div>
                
                <div className="text-center group">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    <svg className="w-12 h-12 text-white group-hover:rotate-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Generate</h3>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    Wait a few seconds and get your new business logo in PNG format. High-quality, professional design ready for immediate use.
                  </p>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="glass inline-block rounded-2xl px-8 py-4 shadow-md">
                  <p className="text-sm text-slate-700 font-medium">
                    <span className="font-bold text-indigo-600">1 credit per logo</span> • Instant download • Commercial use included
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Particle network background */}
            <ParticleBackground />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="mt-4 text-xl text-slate-600">
                  Pay only for what you use. No hidden fees, no subscriptions required.
                </p>
              </div>
              
              <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Single Credit */}
                <div className="glass rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Single Logo</h3>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">£5</span>
                      <span className="text-slate-600 block mt-2">/logo</span>
                    </div>
                    <p className="mt-6 text-slate-600">Perfect for trying us out</p>
                    <Link
                      href="/signup"
                      className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>

                {/* Small Pack */}
                <div className="glass rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Small Pack</h3>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">£10</span>
                      <span className="text-slate-600 block mt-2">/10 logos</span>
                    </div>
                    <p className="mt-6 text-emerald-600 font-semibold">50% savings</p>
                    <Link
                      href="/signup"
                      className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>

                {/* Medium Pack */}
                <div className="glass rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Medium Pack</h3>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">£50</span>
                      <span className="text-slate-600 block mt-2">/100 logos</span>
                    </div>
                    <p className="mt-6 text-emerald-600 font-semibold">90% savings</p>
                    <Link
                      href="/signup"
                      className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>

                {/* Large Pack - Featured */}
                <div className="glass-strong rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300 relative border-2 border-indigo-500/50 group">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 text-sm font-bold rounded-full shadow-lg">Best Value</span>
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Large Pack</h3>
                    <div className="mt-6">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">£250</span>
                      <span className="text-slate-600 block mt-2">/1000 logos</span>
                    </div>
                    <p className="mt-6 text-purple-600 font-bold">95% savings - Just 25p per logo!</p>
                    <Link
                      href="/signup"
                      className="mt-8 w-full inline-flex justify-center items-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="glass inline-block rounded-2xl px-8 py-4 shadow-md">
                  <p className="text-sm text-slate-700 font-medium">
                    All prices include VAT • Credits never expire • Secure payment via Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Why Choose SimplyLogos?
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Everything you need for professional logos at unbeatable prices
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300 group-hover:rotate-12 transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Lightning Fast</h3>
                  <p className="mt-2 text-gray-600">
                    Generate professional logos in seconds, not hours. Our AI-powered system delivers results instantly.
                  </p>
                </div>
                
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300 group-hover:rotate-12 transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">High Quality</h3>
                  <p className="mt-2 text-gray-600">
                    Professional-grade logos suitable for any business use. Print-ready PNG files with commercial licensing included.
                  </p>
                </div>
                
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300 group-hover:rotate-12 transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Incredibly Affordable</h3>
                  <p className="mt-2 text-gray-600">
                    Starting from just £5 per logo, or as low as <span className="font-semibold text-indigo-600">25p per logo</span> when buying in bulk. No subscriptions required.
                  </p>
                </div>
                
                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300 group-hover:rotate-12 transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Easy to Use</h3>
                  <p className="mt-2 text-gray-600">
                    Simple interface that anyone can use to create amazing logos. No design experience required.
                  </p>
                </div>

                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300 group-hover:rotate-12 transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Secure & Reliable</h3>
                  <p className="mt-2 text-gray-600">
                    Secure payment processing via Stripe. Your credits never expire and your data is always protected.
                  </p>
                </div>

                <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors duration-300 group-hover:rotate-12 transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Unlimited Revisions</h3>
                  <p className="mt-2 text-gray-600">
                    Generate as many variations as you need. Each logo is unique and tailored to your specific requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="py-20 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
            {/* Particle network background */}
            <ParticleBackground />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  See SimplyLogos in Action
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Watch how easy it is to create professional logos in seconds
                </p>
              </div>
              
              <div className="mt-16">
                <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Demo Video Coming Soon</h3>
                      <p className="text-gray-600">Watch our platform in action</p>
                    </div>
                  </div>
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
        
        {/* Footer */}
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo Rotation */}
      <header className="bg-[#e7e7e7] shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/">
                <LogoRotation />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">
          <LogoGenerator />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}