import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await request.json()
  if (!code?.trim()) return NextResponse.json({ error: 'No code provided' }, { status: 400 })

  const admin = createAdminClient()

  // Get workspace
  const { data: workspace } = await admin
    .from('workspaces')
    .select('id, plan, competitor_limit, ltd_codes_redeemed')
    .eq('owner_id', user.id)
    .single()

  if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 })

  // Check code
  const { data: ltdCode } = await admin
    .from('ltd_codes')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .single()

  if (!ltdCode) return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  if (ltdCode.redeemed_by) return NextResponse.json({ error: 'Code already used' }, { status: 400 })

  // Max 3 codes per workspace
  const alreadyRedeemed = workspace.ltd_codes_redeemed || 0
  if (alreadyRedeemed >= 3) return NextResponse.json({ error: 'Maximum 3 codes per account' }, { status: 400 })

  // Apply code
  const newLimit = (workspace.competitor_limit || 2) + ltdCode.competitor_bonus
  const newPlan = ltdCode.plan === 'agency' ? 'agency' : (workspace.plan === 'agency' ? 'agency' : 'pro')

  await admin.from('workspaces').update({
    competitor_limit: newLimit,
    plan: newPlan,
    ltd_codes_redeemed: alreadyRedeemed + 1,
  }).eq('id', workspace.id)

  await admin.from('ltd_codes').update({
    redeemed_by: workspace.id,
    redeemed_at: new Date().toISOString(),
  }).eq('id', ltdCode.id)

  return NextResponse.json({
    success: true,
    newLimit,
    bonus: ltdCode.competitor_bonus,
    message: `Code applied! +${ltdCode.competitor_bonus} competitor slots added.`,
  })
}
