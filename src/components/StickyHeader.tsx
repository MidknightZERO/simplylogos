'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface StickyHeaderProps {
  isVisible: boolean
}

export default function StickyHeader({ isVisible }: StickyHeaderProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentLogo = logoFiles[currentLogoIndex]

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 bg-[#e7e7e7]/95 backdrop-blur-sm shadow-lg border-b border-gray-200 transition-opacity duration-500 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
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
  )
}
