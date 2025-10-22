import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { generateLogo } from '@/lib/gemini/api'
import { check_reroll_tokens, update_reroll_tokens } from '@/lib/supabase/functions'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { generationId, userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }

    if (!generationId) {
      return NextResponse.json({ error: 'Generation ID is required' }, { status: 400 })
    }

    // Check if user has enough reroll tokens
    const hasTokens = await check_reroll_tokens(userId, 1)
    if (!hasTokens) {
      return NextResponse.json({ error: 'Insufficient reroll tokens' }, { status: 402 })
    }

    // Fetch the original generation to get the prompt and verify ownership
    const { data: originalGeneration, error: fetchError } = await supabaseAdmin
      .from('generations')
      .select('*')
      .eq('id', generationId)
      .single()

    if (fetchError || !originalGeneration) {
      console.error('Error fetching original generation:', fetchError)
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
    }

    // Verify user owns this generation
    if (originalGeneration.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Parse the prompt to extract parameters
    const prompt = originalGeneration.prompt
    let businessName = ''
    let industry = ''
    let elements = ''
    let freeText = ''

    // Check if it's a structured prompt or free text
    if (prompt.includes('Business:') && prompt.includes('Industry:') && prompt.includes('Elements:')) {
      // Structured prompt - parse it
      const businessMatch = prompt.match(/Business:\s*([^,]+)/)
      const industryMatch = prompt.match(/Industry:\s*([^,]+)/)
      const elementsMatch = prompt.match(/Elements:\s*(.+)/)
      
      businessName = businessMatch ? businessMatch[1].trim() : ''
      industry = industryMatch ? industryMatch[1].trim() : ''
      elements = elementsMatch ? elementsMatch[1].trim() : ''
    } else {
      // Free text prompt
      freeText = prompt
    }

    // Create new generation record (linked to parent)
    const { data: newGeneration, error: generationError } = await supabaseAdmin
      .from('generations')
      .insert({
        user_id: userId,
        prompt: prompt,
        status: 'generating',
        is_reroll: true,
        parent_generation_id: generationId,
        credits_used: 0, // Rerolls don't use credits
      })
      .select()
      .single()

    if (generationError) {
      console.error('Error creating reroll generation record:', generationError)
      return NextResponse.json({ error: 'Failed to create generation record' }, { status: 500 })
    }

    // Increment reroll count on parent generation
    await supabaseAdmin
      .from('generations')
      .update({ reroll_count: (originalGeneration.reroll_count || 0) + 1 })
      .eq('id', generationId)

    // Generate logo using Gemini with same parameters
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
        .eq('id', newGeneration.id)

      return NextResponse.json({ error: logoResult.error }, { status: 500 })
    }

    // Store the generated image
    const imageUrl = logoResult.imageUrl

    // Update generation record with success
    const { error: updateError } = await supabaseAdmin
      .from('generations')
      .update({
        image_url: imageUrl,
        status: 'completed',
      })
      .eq('id', newGeneration.id)

    if (updateError) {
      console.error('Error updating reroll generation record:', updateError)
      return NextResponse.json({ error: 'Failed to update generation record' }, { status: 500 })
    }

    // Deduct reroll token from user
    await update_reroll_tokens(userId, -1)

    console.log(`✅ Logo rerolled successfully for user ${userId}. Deducted 1 reroll token.`)

    return NextResponse.json({
      success: true,
      generationId: newGeneration.id,
      imageUrl,
      parentGenerationId: generationId,
      isReroll: true,
    })
  } catch (error) {
    console.error('Error in logo reroll:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

