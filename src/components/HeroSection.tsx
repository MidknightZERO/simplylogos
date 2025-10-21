'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  className?: string
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
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
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Only update scroll state if we're not in the middle of a smooth scroll
      if (!isScrolling) {
        const scrollTop = window.scrollY
        setIsScrolled(scrollTop > 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolling])

  const smoothScrollTo = (targetY: number, duration: number = 2000) => {
    const startY = window.pageYOffset
    const distance = targetY - startY
    const startTime = performance.now()

    // Set scrolling state to prevent scroll event handler interference
    setIsScrolling(true)

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeInOutCubic(progress)
      const currentY = startY + (distance * easedProgress)
      
      window.scrollTo(0, currentY)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Animation complete, re-enable scroll event handler
        setIsScrolling(false)
        // Update scroll state manually
        const scrollTop = window.scrollY
        setIsScrolled(scrollTop > 100)
      }
    }

    requestAnimationFrame(animate)
  }

  const scrollToTop = () => {
    smoothScrollTo(0, 2000) // 2 seconds
  }

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('main')
    if (nextSection) {
      const targetPosition = nextSection.offsetTop
      smoothScrollTo(targetPosition, 2500) // 2.5 seconds
    }
  }

  const currentLogo = logoFiles[currentLogoIndex]

  return (
    <div className={`transition-all duration-500 ease-in-out ${className}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        isScrolled ? 'h-20' : 'min-h-screen'
      }`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-[#e7e7e7] to-purple-50"></div>
        
        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
          {/* Logo Container - Centered */}
          <div className={`flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
            isScrolled ? 'scale-50' : 'scale-100'
          }`}>
            <div className={`relative transition-all duration-500 ease-in-out ${
              isScrolled ? 'w-16 h-16' : 'w-96 h-96'
            } mb-8`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/Logos/${currentLogo}`}
                alt="SimplyLogos"
                className="w-full h-full object-contain transition-all duration-300 ease-in-out"
                style={{ imageRendering: 'auto' }}
              />
            </div>
            
            {/* Subtitle - only show when not scrolled */}
            {!isScrolled && (
              <p className="text-xl text-gray-600 text-center mb-8 max-w-2xl">
                Generate stunning, professional logos with AI in seconds. 
                Bring your brand to life with our intelligent design platform.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-in-out ${
            isScrolled ? 'scale-75' : 'scale-100'
          }`}>
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

        {/* Scroll indicator - only show when not scrolled */}
        {!isScrolled && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={scrollToNextSection}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center hover:border-indigo-600 transition-colors cursor-pointer"
            >
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse hover:bg-indigo-600 transition-colors"></div>
            </button>
          </div>
        )}
      </div>

      {/* Sticky Header - appears when scrolled */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#e7e7e7]/95 backdrop-blur-sm shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  onClick={scrollToTop}
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-8 h-8 mr-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/Logos/${currentLogo}`}
                      alt="SimplyLogos"
                      className="w-full h-full object-contain"
                      style={{ imageRendering: 'auto' }}
                    />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Back to Top</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

