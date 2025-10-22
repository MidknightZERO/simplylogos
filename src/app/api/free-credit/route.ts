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
    // Debug logging for environment variables
    console.log('🔍 ENV DEBUG - Free Credit API:', {
      hasIpSalt: !!process.env.IP_SALT,
      ipSaltPreview: process.env.IP_SALT?.substring(0, 10) + '...',
      nodeEnv: process.env.NODE_ENV,
      isServer: typeof window === 'undefined'
    })

    const ip = getClientIp(req)
    if (!ip) return NextResponse.json({ error: 'No IP' }, { status: 400 })

    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    const ipSalt = process.env.IP_SALT
    if (!ipSalt) {
      console.error('❌ IP_SALT is undefined!')
      console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('IP') || key.includes('SALT')))
      return NextResponse.json({ error: 'IP_SALT missing' }, { status: 500 })
    }

    const ipHash = hashIp(ip, ipSalt)

    // Check if IP hash already used by any user
    const { data: existing, error: existingErr } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('signup_ip_hash', ipHash)
      .limit(1)

    if (existingErr) return NextResponse.json({ error: existingErr.message }, { status: 500 })
    if (existing && existing.length > 0 && existing[0].id !== userId) {
      return NextResponse.json({ granted: false, reason: 'ip_used' }, { status: 403 })
    }

    // Fetch current user to see if already granted
    const { data: me, error: meErr } = await supabaseAdmin
      .from('users')
      .select('id, free_credit_granted')
      .eq('id', userId)
      .single()

    if (meErr) return NextResponse.json({ error: meErr.message }, { status: 500 })
    if (!me) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    if (me.free_credit_granted) return NextResponse.json({ granted: false, reason: 'already_granted' }, { status: 200 })

    // Grant 1 credit and store hash
    const { error: upErr } = await supabaseAdmin
      .from('users')
      .update({ signup_ip_hash: ipHash, free_credit_granted: true })
      .eq('id', userId)

    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    // Increment credits by 1 via function to avoid race conditions
    const { error: creditErr } = await supabaseAdmin.rpc('update_user_credits', { user_uuid: userId, credit_change: 1 })
    if (creditErr) return NextResponse.json({ error: creditErr.message }, { status: 500 })

    return NextResponse.json({ granted: true })
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}


