import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user data directly from database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('email, credits_balance, reroll_tokens, free_credit_granted, signup_ip_hash')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: userData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Check credits API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

