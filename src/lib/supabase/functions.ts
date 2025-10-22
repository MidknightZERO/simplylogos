import { supabaseAdmin } from './client'

export async function check_user_credits(userId: string, requiredCredits: number): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error checking user credits:', error)
    return false
  }

  return (data?.credits_balance || 0) >= requiredCredits
}

export async function update_user_credits(userId: string, creditChange: number): Promise<void> {
  // First get current credits
  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  if (fetchError) {
    console.error('Error fetching user credits:', fetchError)
    throw new Error('Failed to fetch user credits')
  }

  const newBalance = (user?.credits_balance || 0) + creditChange

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      credits_balance: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user credits:', error)
    throw new Error('Failed to update user credits')
  }
}

export async function get_user_credits(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error getting user credits:', error)
    return 0
  }

  return data?.credits_balance || 0
}

export async function get_user_generations(userId: string, limit: number = 10) {
  const { data, error } = await supabaseAdmin
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error getting user generations:', error)
    return []
  }

  return data || []
}

// Reroll token management functions
export async function check_reroll_tokens(userId: string, requiredTokens: number): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('reroll_tokens')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error checking reroll tokens:', error)
    return false
  }

  return (data?.reroll_tokens || 0) >= requiredTokens
}

export async function update_reroll_tokens(userId: string, tokenChange: number): Promise<void> {
  // First get current tokens
  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('reroll_tokens')
    .eq('id', userId)
    .single()

  if (fetchError) {
    console.error('Error fetching reroll tokens:', fetchError)
    throw new Error('Failed to fetch reroll tokens')
  }

  const newBalance = Math.max(0, (user?.reroll_tokens || 0) + tokenChange)

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      reroll_tokens: newBalance,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Error updating reroll tokens:', error)
    throw new Error('Failed to update reroll tokens')
  }
}

export async function get_reroll_tokens(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('reroll_tokens')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error getting reroll tokens:', error)
    return 0
  }

  return data?.reroll_tokens || 0
}
