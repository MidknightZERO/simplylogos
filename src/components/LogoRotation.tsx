'use client'

import { useState, useEffect, useRef } from 'react'

interface LogoRotationProps {
  className?: string
}

export default function LogoRotation({ className = '' }: LogoRotationProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Complete array of logo filenames (01.png to 48.png)
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

  const currentLogo = logoFiles[currentLogoIndex]

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-20 h-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/Logos/${currentLogo}`}
          alt="SimplyLogos"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            imageRendering: 'auto',
            transform: 'scale(1.4)',
            transformOrigin: 'center'
          }}
        />
      </div>
    </div>
  )
}