import { createClient } from '@supabase/supabase-js'

// Debug logging for environment variables
console.log('🔍 ENV DEBUG - Supabase Client Initialization:', {
  hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
  keyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
  allEnvKeys: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
  nodeEnv: process.env.NODE_ENV,
  isClient: typeof window !== 'undefined'
})

// Use environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is undefined!')
  console.error('Available NEXT_PUBLIC_ env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')))
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined. Check Netlify environment variables.')
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is undefined!')
  console.error('Available NEXT_PUBLIC_ env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')))
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Check Netlify environment variables.')
}

console.log('✅ Supabase environment variables loaded successfully')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to verify Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', supabaseUrl)
    console.log('Key:', supabaseAnonKey?.substring(0, 20) + '...')
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession()
    console.log('Session test result:', { data, error })
    
    return { success: true, data, error }
  } catch (err) {
    console.error('Supabase connection test failed:', err)
    return { success: false, error: err }
  }
}

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)
