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
    const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' })

    // Create a detailed prompt based on the request
    let prompt: string

    if (request.freeText) {
      // Use free text input
      prompt = `Create a professional, modern logo for a business based on this description: ${request.freeText}. 
      
      Requirements:
      - Vector-style design
      - Clean and professional appearance
      - Suitable for business use
      - Transparent background if possible
      - High contrast for visibility
      - Memorable and distinctive
      - Modern typography if text is included
      - Scalable design that works at different sizes`
    } else {
      // Use structured input
      prompt = `Create a professional, modern logo for a business.

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

    const result = await model.generateContent(prompt)
    const response = await result.response

    // Note: The actual image generation response handling will depend on the Gemini API response format
    // This is a placeholder - you'll need to adjust based on the actual API response
    const imageData = response.text() // This might need to be adjusted based on actual API

    return {
      success: true,
      imageUrl: imageData, // This will likely be a base64 data URL or similar
    }
  } catch (error) {
    console.error('Error generating logo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
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
