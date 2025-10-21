'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface HeroSectionProps {
  className?: string
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Complete array of logo filenames
  const logoFiles = [
    '0001_1_a-clean-logo-design-featuring-an-adventu_incAaEJqT86ZTsK8NMVd2g_FnAJsWH1RIWWarF9p3Osqg.png',
    '0002_1_a-clean-professional-hockey-emblem-logo-_pUfUC8LnSYyXnJg6OR_lXg_ZojFwPW-QT-rYSvooEWVWA.png',
    '0003_1_a-star-wars-inspired-logo-design-featuri_xKufvUliThuryW31m2ucww_Zu3-M5ZcTRyQ5uyiIID5dg.png',
    '0004_1_a-clean-minimalist-logo-design-featuring_LDg5DjvgQeObjxqQBEjY0g_QPif0I2jSU24LZxq__zJ2Q.png',
    '0005_1_a-clean-takeaway-food-container-or-bag-d_jU3el7SCTPGa0rxAmf8bYw_u5qSba2jTBGW6Z8BG_lqCg.png',
    '0006_1_a-clean-professional-logo-design-featuri_N8Jn0mVUS36xXPWf8R1pkg_zXQ0fQN-QoC220sexzZdoQ.png',
    '0007_1_a-clean-minimalist-logo-design-featuring_I3_EQyuYTDeQ0M_AjDpOGw_2-g-5VIYTY2ykr3TnZAobQ.png',
    '0008_1_a-clean-typography-design-featuring-the-_90AlQVFiQHKZnsyQhnbaVA_kXwB3U4FR7aocD_LI3U3Dw.png',
    '0009_1_a-clean-minimalist-logo-design-featuring_W5iqLamMQ-WUwjy8ugMVwQ_uh8L_nsgR8uv6ahIczQkDg.png',
    '0010_1_a-cinematic-movie-poster-design-featurin_-6VV5jq9RV2cYWodwkqA3A_s-Hq2HYSTqqs3IOPKA9zyw.png',
    '0011_1_a-pixar-style-3d-rendered-logo-design-fe_NiKUWFjoSK-vjHWpIhCsWw_VwfaGGg0TDuXDMYr9_LPHw.png',
    '0012_1_a-dramatic-typography-design-featuring-t_S9LlGdNlQ-WwpyG2cl1X2w_zhlhubDNT1G3dNy9LnWZxQ.png',
    '0013_1_a-vibrant-logo-design-featuring-the-text_fTZJvXcWQ3er1i2D2N9fSQ_4FkgGjC_T92ygOwj7ecrnQ.png',
    '0014_1_a-clean-logo-design-featuring-egyptian-i_ZHNFWdwoRS2CuXeM4I__Xg_YFPvWcRbT4KUNbDR6Kyxxw.png',
    '0015_1_a-minimalist-logo-design-featuring-styli_bfRvbMidSaycabig2WyaGw_aN9mgErvQnydJzWJXBiezg.png',
    '0016_1_a-bold-minimalist-logo-design-featuring-__w8KxzlXRVq_-csqAWnDeg_imjsaFXjSdGuHYomt6-Lfw.png',
    '0017_1_a-minimalist-logo-design-featuring-the-t_67mPdw15QbGj5bB7lG7KwA_KTEH5rrKQw6VU2dfqsnGUQ.png',
    '0018_1_a-bold-logo-design-featuring-the-text-si_A1TXytyTTcSRHtcI-C4aQg_59I8Voh6Syi40C-IKFN9zQ.png',
    '0019_1_a-bold-typography-design-featuring-the-t_x9ppB7P-SIOAsk34vsTimw_rJj7eKZmQZS6JqFXZOQy0Q.png',
    '0020_1_a-playful-and-whimsical-logo-design-feat_SOG07l7QRV-Xa2JggXX0wQ_kUM-7BprQJqBE8KjdMAmqw.png',
    '0021_1_a-bold-graphic-design-featuring-the-text_v4fDCClhT_KXQyx0x8H8_w_sENDwg2jQ9aYOiakPj3MXA.png',
    '0022_1_a-sleek-and-sophisticated-logo-design-fe_UfCFwUR6RZCm2IjqpFF_sQ_pUucmxttR0aUsm59X3DLjg.png',
    '0023_1_a-death-metal-inspired-logo-design-featu_lJqF5VbSTZaXEGU1dJHXPg_MYUuad4CQmWqYCKX9QkpKw.png',
    '0024_1_a-dynamic-graphic-design-featuring-the-t_d3_oJiaqS2WzEH1Jxjbs2A_s71ps9EAQdKFL5FdgBHURg.png',
    '0025_1_a-bold-graphic-design-featuring-dynamite_728m76WPQvaSmjXnQTjISg_frqOhTzNQoKEkVwmnFl7ww.png',
    '0026_1_a-modern-typographic-design-featuring-th_nwgHGObzTFiQz44kUdvlOg_cMgPtRR7TD-DNBwQhkmSyg.png',
    '0027_1_a-clean-minimalist-logo-design-featuring_PwD3p42fRfi3ouNSS19vMA_cNmwoX0OS72cDKrNwECplA.png',
    '0028_1_a-modern-typography-design-featuring-the_bcyGSucDRmi4H-kbPEs45w_1y0sjgg5RdmILmNAEa262Q.png',
    '0029_1_a-clean-minimalist-logo-design-featuring_OYwe9B8iTRSNEu5W_cqM7g_AsLfhioaQDSIELOlXSO4Lg.png',
    '0030_1_a-clean-product-photograph-of-colorful-l_rvdSG3z4QsubFoRrJsOkYA_Bb_wOAhuTYCDjFVyorJ9yg.png',
    '0031_1_a-modern-3d-text-design-featuring-the-wo_dpBbJlDCTWO7NJd6hFSorA_fdm5ZoRiTNSq-5nWprFP5g.png',
    '0032_1_a-retro-80s-style-logo-design-featuring-_YXIxi6C3Q-ero4nU7IvE5Q_Ys1l9DckRh6jC9pQDDkIQA.png',
    '0033_1_a-clean-logo-design-featuring-the-text-s_d4Evh-TkTq-KNR4quh0lEA_VCBTbbvYS3uEikzaJkVwzw.png',
    '0034_1_a-minimalist-typography-design-featuring_80X10pe4QnCVP3ipHucgOA_os1fbxf_RzmGsaSyuP9EfQ.png',
    '0035_1_a-nostalgic-logo-design-featuring-the-te_4vux84e9S-iKEJ_Ty4Uwrg_9uXP3PaNQoaXPmgtvzuz2g.png',
    '0036_1_a-clean-typography-design-featuring-eleg_CnoZt6d2QHm9GnPM7sY9nQ_6MeyxLKFQ1SvIusCsVI6NQ.png',
    '0037_1_a-futuristic-sci-fi-logo-design-featurin_UJIpL2JhRTW_lWSfGN-RxQ_UierttAlRfaJihtGOug-ug.png',
    '0038_1_a-sleek-logo-design-featuring-a-stylized_-xuhRbUJSgu55X9aye7Xfg_-gBTPtIESXif5BNyf8lujA.png',
    '0039_1_a-striking-logo-design-featuring-the-tex_02UN4BtTRyO5S7s5XOAUMg_QEQNOH2ORw6fHYuHsCIttg.png',
    '0040_1_a-clean-professional-logo-design-featuri_kSez5nZsRiyfS3-FWy63Uw_t_YhCkhxRYOmxpaSpSzTqA.png',
    '0041_1_a-playful-logo-design-featuring-quirky-h_fqcVLkO0QH-LIdDWGN-Uhw_19bd4koARAC-VdlHd3MstQ.png',
    '0042_1_a-clean-minimalist-logo-design-featuring_jjo8Y3ItTdW_fw_Wj_pkqQ_UBZBWlabRQmhorrjKaobdA.png',
    'a-clean-and-modern-company-logo-design-f_B2Wk0lGuTQumNM4EYet81Q_YGGmnhfSQHeIq-0m8zNvtQ.png',
    'a-clean-and-professional-logo-design-fea_aW6sC1pkQxOt4pkVoVI39A_TMGQjf4aQ4e02jprnT41jg.png',
    'a-clean-logo-design-featuring-the-text-s_R1whUbVTRweLrNaZcgqrsg_tOuUF9jSRlWvhhbO4aPEYQ.png',
    'a-clean-modern-company-design-featu_I5RCN3VrTdemrS6YPiBS_A_gHYyr_ATSHCMTU1aqOKojg.png',
    'a-modern-k-pop-inspired-logo-design-feat_TV6M8hRfQNK9asp-vsdjUQ_7oyJI9aJQwKE378nAh1I3w.png',
    'a-vibrant-graffiti-style-artwork-featuri_UqS8VBeTSQWjYTPL_vdgwg_zXDIX2vlRn6TdMgub0ze_A.png'
  ]

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
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('main')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

