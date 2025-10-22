// Test Supabase connection
import { supabase } from '@/lib/supabase/client'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase connection successful:', data)
    return { success: true, data }
  } catch (err) {
    console.error('Supabase connection failed:', err)
    return { success: false, error: err }
  }
}
