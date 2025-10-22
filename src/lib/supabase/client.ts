import { createClient } from '@supabase/supabase-js'

// Use the exact URL and key you provided
const supabaseUrl = 'https://pwtihvcjbvenexmbymkv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3dGlodmNqYnZlbmV4bWJ5bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNjc1MzYsImV4cCI6MjA3NjY0MzUzNn0.eJYFMX35J0l1H5_YMTv0yzp3GuQX1QS1YTYDYemDsTk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
)
