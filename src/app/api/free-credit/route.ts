import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/client'

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  const xri = req.headers.get('x-real-ip')
  if (xri) return xri
  return (req as { ip?: string }).ip || null
}

function hashIp(ip: string, salt?: string): string {
  const usedSalt = salt || ''
  return crypto.createHmac('sha256', usedSalt).update(ip).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 Free Credit API - Processing request')

    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const ip = getClientIp(req)
    const ipSalt = process.env.IP_SALT

    // Fetch current user
    const { data: me, error: meErr } = await supabaseAdmin
      .from('users')
      .select('id, free_credit_granted, signup_ip_hash, credits_balance, reroll_tokens')
      .eq('id', userId)
      .single()

    if (meErr) {
      console.error('Error fetching user:', meErr)
      return NextResponse.json({ error: meErr.message }, { status: 500 })
    }
    if (!me) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    console.log('User data:', {
      userId,
      free_credit_granted: me.free_credit_granted,
      credits_balance: me.credits_balance,
      reroll_tokens: me.reroll_tokens
    })

    // If already granted, return early
    if (me.free_credit_granted) {
      return NextResponse.json({ granted: false, reason: 'already_granted' }, { status: 200 })
    }

    // Check IP hash if available
    if (ip && ipSalt) {
      const ipHash = hashIp(ip, ipSalt)
      
      // Check if IP hash already used by any other user
      const { data: existing, error: existingErr } = await supabaseAdmin
        .from('users')
        .select('id, free_credit_granted')
        .eq('signup_ip_hash', ipHash)
        .limit(1)

      if (existingErr) {
        console.error('Error checking IP hash:', existingErr)
      } else if (existing && existing.length > 0 && existing[0].id !== userId && existing[0].free_credit_granted) {
        console.log('IP already used for free credit by another user')
        return NextResponse.json({ granted: false, reason: 'ip_used' }, { status: 403 })
      }

      // Update with IP hash
      const { error: upErr } = await supabaseAdmin
        .from('users')
        .update({ signup_ip_hash: ipHash, free_credit_granted: true })
        .eq('id', userId)

      if (upErr) {
        console.error('Error updating user with IP hash:', upErr)
        return NextResponse.json({ error: upErr.message }, { status: 500 })
      }
    } else {
      // No IP tracking, just mark as granted
      const { error: upErr } = await supabaseAdmin
        .from('users')
        .update({ free_credit_granted: true })
        .eq('id', userId)

      if (upErr) {
        console.error('Error marking free credit as granted:', upErr)
        return NextResponse.json({ error: upErr.message }, { status: 500 })
      }
    }

    console.log('✅ Free credit marked as granted for user:', userId)
    return NextResponse.json({ granted: true })
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.error('Free credit API error:', errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


