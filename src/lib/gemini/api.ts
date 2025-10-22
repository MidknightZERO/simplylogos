import { GoogleGenerativeAI } from '@google/generative-ai'

// Debug logging for environment variables
console.log('🔍 ENV DEBUG - Gemini API Initialization:', {
  hasApiKey: !!process.env.GOOGLE_GEMINI_API_KEY,
  apiKeyPreview: process.env.GOOGLE_GEMINI_API_KEY?.substring(0, 20) + '...',
  nodeEnv: process.env.NODE_ENV,
  isServer: typeof window === 'undefined'
})

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  console.error('❌ GOOGLE_GEMINI_API_KEY is undefined!')
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI') || key.includes('GOOGLE')))
  throw new Error('GOOGLE_GEMINI_API_KEY is not defined. Check Netlify environment variables.')
}

const geminiApiKey: string = process.env.GOOGLE_GEMINI_API_KEY

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
      // Use free text input
      promptText = `Create a professional, modern logo: ${request.freeText}. Style: vector-style, clean, professional, suitable for business use, transparent background, high contrast, memorable, distinctive, modern typography if text is included, scalable design.`
    } else {
      // Use structured input
      promptText = `Create a professional, modern logo for "${request.businessName}", a ${request.industry} business. Include these elements: ${request.elements}. Style: vector-style, clean, professional, transparent background, high contrast, memorable, distinctive, modern typography, scalable design.`
    }

    console.log('🎨 Generating logo with Imagen 4.0, prompt:', promptText)

    // Use Imagen 4.0 API with correct endpoint
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict',
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': geminiApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: promptText,
            },
          ],
          parameters: {
            sampleCount: 1, // Generate 1 image
            aspectRatio: '1:1', // Square logo
            personGeneration: 'allow_adult', // Default setting
          },
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Imagen API error:', response.status, errorText)
      throw new Error(`Imagen API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Imagen API response received')

    // Extract the generated image from the response
    if (data.predictions && data.predictions.length > 0) {
      const prediction = data.predictions[0]
      
      // The API returns base64 encoded image data
      if (prediction.bytesBase64Encoded) {
        const imageUrl = `data:image/png;base64,${prediction.bytesBase64Encoded}`
        console.log('✅ Logo generated successfully')
        
        return {
          success: true,
          imageUrl: imageUrl,
        }
      } else if (prediction.mimeType && prediction.bytesBase64Encoded) {
        const imageUrl = `data:${prediction.mimeType};base64,${prediction.bytesBase64Encoded}`
        console.log('✅ Logo generated successfully')
        
        return {
          success: true,
          imageUrl: imageUrl,
        }
      }
    }

    console.error('❌ No image data in response:', JSON.stringify(data))
    throw new Error('No image generated in response')
  } catch (error) {
    console.error('❌ Error generating logo:', error)
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
