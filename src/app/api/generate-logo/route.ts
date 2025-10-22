import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { generateLogo } from '@/lib/gemini/api'
import { check_user_credits, update_user_credits, update_reroll_tokens } from '@/lib/supabase/functions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, industry, elements, freeText, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    // Debug: Log user info and check credits
    console.log('🔍 GENERATE LOGO - User ID:', userId)
    
    // Get actual user data to debug
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('email, credits_balance, reroll_tokens')
      .eq('id', userId)
      .single()

    console.log('🔍 GENERATE LOGO - User data:', userData, 'Error:', userError)

    // Check if user has enough credits
    const hasCredits = await check_user_credits(userId, 1)
    console.log('🔍 GENERATE LOGO - Has credits check:', hasCredits)
    
    if (!hasCredits) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        debug: {
          userId,
          email: userData?.email,
          currentCredits: userData?.credits_balance,
          requiredCredits: 1
        }
      }, { status: 402 })
    }

    // Validate input
    if (!freeText && (!businessName || !industry || !elements)) {
      return NextResponse.json(
        { error: 'Business name, industry, and elements are required' },
        { status: 400 }
      )
    }

    // Create generation record
    const { data: generation, error: generationError } = await supabaseAdmin
      .from('generations')
      .insert({
        user_id: userId,
        prompt: freeText || `Business: ${businessName}, Industry: ${industry}, Elements: ${elements}`,
        status: 'generating',
      })
      .select()
      .single()

    if (generationError) {
      console.error('Error creating generation record:', generationError)
      return NextResponse.json({ error: 'Failed to create generation record' }, { status: 500 })
    }

    // Generate logo using Gemini
    const logoResult = await generateLogo({
      businessName,
      industry,
      elements,
      freeText,
    })

    if (!logoResult.success) {
      // Update generation record with failure
      await supabaseAdmin
        .from('generations')
        .update({ status: 'failed' })
        .eq('id', generation.id)

      return NextResponse.json({ error: logoResult.error }, { status: 500 })
    }

    // Store the generated image (you'll need to implement image storage)
    // For now, we'll assume the image URL is returned
    const imageUrl = logoResult.imageUrl

    // Update generation record with success
    const { error: updateError } = await supabaseAdmin
      .from('generations')
      .update({
        image_url: imageUrl,
        status: 'completed',
      })
      .eq('id', generation.id)

    if (updateError) {
      console.error('Error updating generation record:', updateError)
      return NextResponse.json({ error: 'Failed to update generation record' }, { status: 500 })
    }

    // Deduct credits from user
    await update_user_credits(userId, -1)

    // Grant 1 reroll token for spending a credit
    await update_reroll_tokens(userId, 1)

    console.log(`✅ Logo generated successfully for user ${userId}. Granted 1 reroll token.`)

    return NextResponse.json({
      success: true,
      generationId: generation.id,
      imageUrl,
      rerollTokenGranted: true,
    })
  } catch (error) {
    console.error('Error in logo generation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
