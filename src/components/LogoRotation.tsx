'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

interface LogoRotationProps {
  className?: string
}

export default function LogoRotation({ className = '' }: LogoRotationProps) {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0)
  const [preloadedLogos, setPreloadedLogos] = useState<string[]>([])
  const [allLogos, setAllLogos] = useState<string[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate logo paths
  const generateLogoPaths = () => {
    const logos: string[] = []
    
    // Add numbered logos (0001-0042) - using actual filenames from the directory
    const numberedLogos = [
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
      '0042_1_a-clean-minimalist-logo-design-featuring_jjo8Y3ItTdW_fw_Wj_pkqQ_UBZBWlabRQmhorrjKaobdA.png'
    ]
    
    numberedLogos.forEach(logo => {
      logos.push(`/Logos/${logo}`)
    })
    
    // Add the additional logos
    const additionalLogos = [
      'a-clean-and-modern-company-logo-design-f_B2Wk0lGuTQumNM4EYet81Q_YGGmnhfSQHeIq-0m8zNvtQ.png',
      'a-clean-and-professional-logo-design-fea_aW6sC1pkQxOt4pkVoVI39A_TMGQjf4aQ4e02jprnT41jg.png',
      'a-clean-logo-design-featuring-the-text-s_R1whUbVTRweLrNaZcgqrsg_tOuUF9jSRlWvhhbO4aPEYQ.png',
      'a-clean-modern-company-logo-design-featu_I5RCN3VrTdemrS6YPiBS_A_gHYyr_ATSHCMTU1aqOKojg.png',
      'a-modern-k-pop-inspired-logo-design-feat_TV6M8hRfQNK9asp-vsdjUQ_7oyJI9aJQwKE378nAh1I3w.png',
      'a-vibrant-graffiti-style-artwork-featuri_UqS8BBeTSQWjYTPL_vdgwg_zXDIX2vlRn6TdMgub0ze_A.png'
    ]
    
    additionalLogos.forEach(logo => {
      logos.push(`/Logos/${logo}`)
    })
    
    return logos
  }

  // Preload images
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = src
    })
  }

  // Get random logo index
  const getRandomLogoIndex = useCallback((excludeIndex?: number): number => {
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * allLogos.length)
    } while (randomIndex === excludeIndex && allLogos.length > 1)
    return randomIndex
  }, [allLogos.length])

  useEffect(() => {
    const logos = generateLogoPaths()
    setAllLogos(logos)

    // Preload first 6 logos
    const preloadFirstSix = async () => {
      const firstSix = logos.slice(0, 6)
      try {
        await Promise.all(firstSix.map(preloadImage))
        setPreloadedLogos(firstSix)
      } catch (error) {
        console.error('Error preloading logos:', error)
        setPreloadedLogos(firstSix) // Still set them even if preload fails
      }
    }

    preloadFirstSix()

    // Start rotation
    intervalRef.current = setInterval(() => {
      setCurrentLogoIndex(prevIndex => getRandomLogoIndex(prevIndex))
    }, 600) // 0.6 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Preload more logos as needed
  useEffect(() => {
    if (allLogos.length > 0 && preloadedLogos.length < allLogos.length) {
      const nextBatch = allLogos.slice(preloadedLogos.length, preloadedLogos.length + 6)
      if (nextBatch.length > 0) {
        Promise.all(nextBatch.map(preloadImage))
          .then(() => {
            setPreloadedLogos(prev => [...prev, ...nextBatch])
          })
          .catch(error => {
            console.error('Error preloading additional logos:', error)
            setPreloadedLogos(prev => [...prev, ...nextBatch])
          })
      }
    }
  }, [preloadedLogos.length, allLogos])

  if (allLogos.length === 0) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="text-2xl font-bold text-gray-900">SimplyLogos</span>
      </div>
    )
  }

  const currentLogo = allLogos[currentLogoIndex]

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-8 h-8 mr-2">
        <Image
          src={currentLogo}
          alt="SimplyLogos"
          fill
          className="object-contain"
          priority={preloadedLogos.includes(currentLogo)}
          sizes="32px"
        />
      </div>
      <span className="text-2xl font-bold text-gray-900">SimplyLogos</span>
    </div>
  )
}
