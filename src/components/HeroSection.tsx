'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  className?: string
  onScrollStateChange?: (isScrolled: boolean) => void
}

export default function HeroSection({ className = '', onScrollStateChange }: HeroSectionProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Complete array of logo filenames (01.png to 48.png)
  const logoFiles = Array.from({ length: 48 }, (_, i) => `${String(i + 1).padStart(2, '0')}.png`)

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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-[#e7e7e7] to-purple-50"></div>
        
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
            <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl">
              Generate stunning, professional logos with AI in seconds. 
              Bring your brand to life with our intelligent design platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-indigo-600 text-lg font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105"
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

