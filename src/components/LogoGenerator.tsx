'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/useUser'

interface LogoGeneratorProps {
  onGenerationComplete?: (imageUrl: string) => void
}

export default function LogoGenerator({ onGenerationComplete }: LogoGeneratorProps) {
  const { user } = useUser()
  const [mode, setMode] = useState<'guided' | 'free'>('guided')
  const [businessName, setBusinessName] = useState('')
  const [industry, setIndustry] = useState('')
  const [elements, setElements] = useState('')
  const [freeText, setFreeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loadingStep, setLoadingStep] = useState('')

  const handleGenerate = async () => {
    if (!user) {
      setError('Please sign in to generate logos')
      return
    }

    if (mode === 'guided' && (!businessName || !industry || !elements)) {
      setError('Please fill in all fields')
      return
    }

    if (mode === 'free' && !freeText.trim()) {
      setError('Please enter your logo description')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedImage(null)

    try {
      // Step 1: Crafting prompt
      setLoadingStep('Crafting your prompt...')
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Generating logo
      setLoadingStep('Generating your logo...')
      
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName,
          industry,
          elements,
          freeText: mode === 'free' ? freeText : undefined,
          userId: user.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate logo')
      }

      // Step 3: Almost there
      setLoadingStep('Almost there...')
      await new Promise(resolve => setTimeout(resolve, 500))

      setGeneratedImage(result.imageUrl)
      setLoadingStep('')
      
      if (onGenerationComplete) {
        onGenerationComplete(result.imageUrl)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `${businessName || 'logo'}-logo.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="glass-strong rounded-3xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 text-center">
          Generate Your Perfect Logo
        </h1>
        <p className="text-slate-600 text-center mb-8">Create stunning, professional logos in seconds with AI</p>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="glass rounded-2xl p-1.5 shadow-md">
            <button
              onClick={() => setMode('guided')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                mode === 'guided'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Guided Mode
            </button>
            <button
              onClick={() => setMode('free')}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                mode === 'free'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Free Text Mode
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-6">
          {mode === 'guided' ? (
            <>
              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-slate-700 mb-3">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="e.g., TechCorp Solutions"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-semibold text-slate-700 mb-3">
                  Industry/Business Type *
                </label>
                <input
                  type="text"
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="e.g., Technology, Healthcare, Restaurant"
                />
              </div>

              <div>
                <label htmlFor="elements" className="block text-sm font-semibold text-slate-700 mb-3">
                  Desired Elements *
                </label>
                <textarea
                  id="elements"
                  value={elements}
                  onChange={(e) => setElements(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                  placeholder="e.g., Mountain icon, blue color scheme, modern typography"
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="freeText" className="block text-sm font-semibold text-slate-700 mb-3">
                Describe Your Logo *
              </label>
              <textarea
                id="freeText"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={7}
                className="w-full px-4 py-3 bg-white/90 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                placeholder="Describe exactly what you want your logo to look like. Include details about colors, style, symbols, text, and any specific requirements..."
              />
              <p className="mt-3 text-sm text-slate-500 font-medium">
                {freeText.length}/500 characters
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Generating...' : 'Generate Logo'}
          </button>
        </div>

        {/* Loading States */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-3 glass rounded-2xl px-6 py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-slate-700 font-medium">{loadingStep}</span>
            </div>
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && (
          <div className="mt-10">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Your Generated Logo</h3>
              <div className="glass rounded-2xl p-6 inline-block shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImage}
                  alt="Generated logo"
                  className="max-w-full h-auto max-h-96 rounded-xl"
                />
              </div>
              <div className="mt-6 flex gap-4 justify-center flex-wrap">
                <button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => setGeneratedImage(null)}
                  className="glass hover:glass-strong text-slate-700 px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  Generate Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
