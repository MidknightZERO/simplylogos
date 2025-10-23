'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ParticleBackground from './ParticleBackground'

interface HeroSectionProps {
  className?: string
  onScrollStateChange?: (isScrolled: boolean) => void
}

export default function HeroSection({ className = '', onScrollStateChange }: HeroSectionProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Complete array of logo filenames (01.png to 50.png)
  const logoFiles = Array.from({ length: 50 }, (_, i) => `${String(i + 1).padStart(2, '0')}.png`)

  useEffect(() => {
    // Start rotation
    intervalRef.current = setInterval(() => {
      setCurrentLogoIndex(prevIndex => {
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * logoFiles.length)
        } while (newIndex === prevIndex && logoFiles.length > 1)
        return newIndex
      })
    }, 600) // 0.6 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [logoFiles.length])

  useEffect(() => {
    const heroElement = document.querySelector('[data-hero-section]')
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const scrolled = !entry.isIntersecting
        setIsScrolled(scrolled)
        onScrollStateChange?.(scrolled)
      },
      { threshold: 0.1 } // Trigger when 10% visible
    )
    
    if (heroElement) observer.observe(heroElement)
    return () => observer.disconnect()
  }, [onScrollStateChange])

  const scrollToNextSection = () => {
    const main = document.querySelector('main')
    main?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentLogo = logoFiles[currentLogoIndex]

  return (
    <div className={`transition-all duration-500 ease-in-out ${className}`}>
      {/* Hero Section - Always h-screen to prevent layout shifts */}
      <div className="h-screen relative overflow-hidden" data-hero-section>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>
        
        {/* Particle network background */}
        <ParticleBackground />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Content - Use opacity transitions instead of height changes */}
        <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-4 transition-opacity duration-500 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}>
          {/* Logo Container - Centered */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-96 h-96 mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/Logos/${currentLogo}`}
                alt="SimplyLogos"
                className="w-full h-full object-contain transition-all duration-300 ease-in-out"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            
            {/* Subtitle */}
            <p className="text-2xl text-slate-700 text-center mb-12 max-w-2xl font-medium">
              Generate stunning, professional logos with AI in seconds. 
              Bring your brand to life with our intelligent design platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 hover:scale-110 hover:shadow-3xl active:scale-95"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl text-indigo-700 glass hover:glass-strong focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce transition-opacity duration-500 ${
          isScrolled ? 'opacity-0' : 'opacity-100'
        }`}>
          <button
            onClick={scrollToNextSection}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center hover:border-indigo-600 transition-colors cursor-pointer"
          >
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse hover:bg-indigo-600 transition-colors"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

