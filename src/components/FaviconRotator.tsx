'use client'

import { useEffect, useRef } from 'react'

export default function FaviconRotator() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Ensure a favicon link exists
    const ensureFaviconLink = () => {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/png'
        document.head.appendChild(link)
      }
      return link
    }

    const link = ensureFaviconLink()

    // Build logo list 01.png - 48.png
    const logos = Array.from({ length: 48 }, (_, i) => `/Logos/${String(i + 1).padStart(2, '0')}.png`)

    // Preload first 6
    logos.slice(0, 6).forEach((src) => {
      const img = new Image()
      img.src = src
    })

    let current = 0
    const update = () => {
      current = (current + 1) % logos.length
      link.href = logos[current]
    }

    // Set initial favicon
    link.href = logos[0]
    intervalRef.current = setInterval(update, 600)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return null
}


