import { createClient, SupabaseClient } from '@supabase/supabase-js'

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

// TEMPORARY FIX: Hardcode values to test if env var injection is the issue
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwtihvcjbvenexmbymkv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGlodmNqYnZlbmV4bWJ5bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjc1MzYsImV4cCI6MjA3NjY0MzUzNn0.eJYFMX35J0l1H5_YMTv0yzp3GuQX1QS1YTYDYemDsTk'

console.log('🔧 USING VALUES:', {
  url: supabaseUrl,
  key: supabaseAnonKey.substring(0, 20) + '...',
  isHardcoded: !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
})

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

// Create client lazily to avoid multiple instances
let _supabase: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    console.log('🔧 CREATING SUPABASE CLIENT:', {
      url: supabaseUrl,
      keyLength: supabaseAnonKey.length,
      keyType: typeof supabaseAnonKey,
      keyIsEmpty: supabaseAnonKey === '',
      keyIsUndefined: supabaseAnonKey === undefined
    })
    
    try {
      _supabase = createClient(supabaseUrl, supabaseAnonKey)
      console.log('✅ Supabase client created successfully')
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error)
      throw error
    }
  }
  return _supabase
}

export const supabase = getSupabaseClient()

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

// Server-side client with service role key (only create on server-side)
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdminClient(): SupabaseClient {
  // Only create admin client on server-side
  if (typeof window !== 'undefined') {
    throw new Error('supabaseAdmin should only be used on the server-side')
  }
  
  if (!_supabaseAdmin) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('🔧 CREATING SUPABASE ADMIN CLIENT:', {
      hasServiceRoleKey: !!serviceRoleKey,
      keyLength: serviceRoleKey?.length || 0,
      isServer: typeof window === 'undefined'
    })
    
    if (!serviceRoleKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is undefined!')
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined. Check Netlify environment variables.')
    }
    
    try {
      _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)
      console.log('✅ Supabase admin client created successfully')
    } catch (error) {
      console.error('❌ Failed to create Supabase admin client:', error)
      throw error
    }
  }
  return _supabaseAdmin
}

// Only export admin client if we're on server-side
export const supabaseAdmin = typeof window === 'undefined' ? getSupabaseAdminClient() : null as unknown as SupabaseClient
