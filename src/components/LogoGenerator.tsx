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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Generate Your Perfect Logo
        </h1>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('guided')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'guided'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Guided Mode
            </button>
            <button
              onClick={() => setMode('free')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                mode === 'free'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., TechCorp Solutions"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                  Industry/Business Type *
                </label>
                <input
                  type="text"
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Technology, Healthcare, Restaurant"
                />
              </div>

              <div>
                <label htmlFor="elements" className="block text-sm font-medium text-gray-700 mb-2">
                  Desired Elements *
                </label>
                <textarea
                  id="elements"
                  value={elements}
                  onChange={(e) => setElements(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Mountain icon, blue color scheme, modern typography"
                />
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="freeText" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Logo *
              </label>
              <textarea
                id="freeText"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe exactly what you want your logo to look like. Include details about colors, style, symbols, text, and any specific requirements..."
              />
              <p className="mt-2 text-sm text-gray-500">
                {freeText.length}/500 characters
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Logo'}
          </button>
        </div>

        {/* Loading States */}
        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              <span className="text-gray-600">{loadingStep}</span>
            </div>
          </div>
        )}

        {/* Generated Image */}
        {generatedImage && (
          <div className="mt-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Generated Logo</h3>
              <div className="bg-gray-50 rounded-lg p-4 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedImage}
                  alt="Generated logo"
                  className="max-w-full h-auto max-h-96"
                />
              </div>
              <div className="mt-4 space-x-4">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => setGeneratedImage(null)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
