'use client'

import { useState, useEffect, useRef } from 'react'

interface LogoRotationProps {
  className?: string
}

export default function LogoRotation({ className = '' }: LogoRotationProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simple array of logo filenames - just a few for testing
  const logoFiles = [
    '0001_1_a-clean-logo-design-featuring-an-adventu_incAaEJqT86ZTsK8NMVd2g_FnAJsWH1RIWWarF9p3Osqg.png',
    '0002_1_a-clean-professional-hockey-emblem-logo-_pUfUC8LnSYyXnJg6OR_lXg_ZojFwPW-QT-rYSvooEWVWA.png',
    '0003_1_a-star-wars-inspired-logo-design-featuri_xKufvUliThuryW31m2ucww_Zu3-M5ZcTRyQ5uyiIID5dg.png'
  ]

  useEffect(() => {
    console.log('LogoRotation component mounted')
    
    // Start rotation
    intervalRef.current = setInterval(() => {
      setCurrentLogoIndex(prevIndex => {
        let newIndex
        do {
          newIndex = Math.floor(Math.random() * logoFiles.length)
        } while (newIndex === prevIndex && logoFiles.length > 1)
        console.log('Changing logo to index:', newIndex)
        return newIndex
      })
    }, 600) // 0.6 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const currentLogo = logoFiles[currentLogoIndex]
  console.log('Rendering logo:', currentLogo)

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-8 h-8 mr-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/Logos/${currentLogo}`}
          alt="SimplyLogos"
          className="w-full h-full object-contain"
          style={{ imageRendering: 'auto' }}
          onLoad={() => console.log('Logo loaded:', currentLogo)}
          onError={(e) => console.error('Logo failed to load:', currentLogo, e)}
        />
      </div>
      <span className="text-2xl font-bold text-gray-900">SimplyLogos</span>
    </div>
  )
}
