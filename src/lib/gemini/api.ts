import { GoogleGenerativeAI } from '@google/generative-ai'

// Debug logging for environment variables
console.log('🔍 ENV DEBUG - Gemini API Initialization:', {
  hasApiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
  apiKeyPreview: process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 20) + '...',
  nodeEnv: process.env.NODE_ENV,
  isServer: typeof window === 'undefined'
})

const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY

if (!geminiApiKey) {
  console.error('❌ GOOGLE_GEMINI_API_KEY is undefined!')
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('GOOGLE')))
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined. Check Netlify environment variables.')
}

console.log('✅ Gemini API environment variables loaded successfully')

const genAI = new GoogleGenerativeAI(geminiApiKey)

export interface LogoGenerationRequest {
  businessName: string
  industry: string
  elements: string
  freeText?: string
}

export interface LogoGenerationResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export async function generateLogo(request: LogoGenerationRequest): Promise<LogoGenerationResponse> {
  try {
    // Create a detailed prompt based on the request
    let promptText: string

    if (request.freeText) {
      promptText = request.freeText
    } else {
      promptText = `Business Name: ${request.businessName}, Industry: ${request.industry}, Elements: ${request.elements}`
    }

    console.log('🎨 Generating logo with prompt:', promptText)

    // TEMPORARY: For now, return a placeholder response
    // TODO: Implement actual Imagen 3 API integration when Vertex AI is set up
    // Imagen 3 requires Google Cloud Vertex AI, not the standard Gemini API
    
    // Generate a placeholder logo URL (you can replace this with actual API integration)
    // For testing, we'll create a data URL with the prompt embedded
    const canvas = await createPlaceholderLogo(promptText)
    
    return {
      success: true,
      imageUrl: canvas,
    }
  } catch (error) {
    console.error('Error generating logo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

async function createPlaceholderLogo(prompt: string): Promise<string> {
  // Create an SVG placeholder logo with the business details
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(99,102,241);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(139,92,246);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#grad1)"/>
      <text x="256" y="256" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">
        ${prompt.substring(0, 30)}
      </text>
      <text x="256" y="300" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.8">
        Logo Generation
      </text>
      <text x="256" y="330" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.6">
        Placeholder - Awaiting Imagen API
      </text>
    </svg>
  `
  
  // Convert SVG to base64 data URL
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

export function formatPrompt(request: LogoGenerationRequest): string {
  if (request.freeText) {
    return `Create a professional, modern logo for a business based on this description: ${request.freeText}. 
    
    Requirements:
    - Vector-style design
    - Clean and professional appearance
    - Suitable for business use
    - Transparent background if possible
    - High contrast for visibility
    - Memorable and distinctive
    - Modern typography if text is included
    - Scalable design that works at different sizes`
  }

  return `Create a professional, modern logo for a business.

  Business Name: ${request.businessName}
  Industry: ${request.industry}
  Desired Elements: ${request.elements}

  Requirements:
  - Vector-style design
  - Clean and professional appearance
  - Suitable for business use in the ${request.industry} industry
  - Transparent background if possible
  - High contrast for visibility
  - Memorable and distinctive
  - Modern typography for the business name
  - Scalable design that works at different sizes
  - Incorporate the requested elements: ${request.elements}`
}
