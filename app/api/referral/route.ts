import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

// Called on workspace creation — generates referral code
export async function POST(request: NextRequest) {
  const admin = createAdminClient()
  const { workspaceId } = await request.json()
  if (!workspaceId) return NextResponse.json({ error: 'No workspaceId' }, { status: 400 })

  const code = Math.random().toString(36).substring(2, 8).toUpperCase()
  await admin.from('workspaces').update({ referral_code: code }).eq('id', workspaceId)

  return NextResponse.json({ code })
}

// Called when someone signs up with ?ref=CODE — gives referrer +1 slot
export async function PATCH(request: NextRequest) {
  const admin = createAdminClient()
  const { referralCode, newWorkspaceId } = await request.json()
  if (!referralCode || !newWorkspaceId) return NextResponse.json({ error: 'Missing params' }, { status: 400 })

  // Find referrer
  const { data: referrer } = await admin
    .from('workspaces')
    .select('id, competitor_limit')
    .eq('referral_code', referralCode.toUpperCase())
    .single()

  if (!referrer) return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
  if (referrer.id === newWorkspaceId) return NextResponse.json({ error: 'Cannot refer yourself' }, { status: 400 })

  // Give referrer +1 slot
  await admin.from('workspaces').update({
    competitor_limit: (referrer.competitor_limit || 2) + 1,
  }).eq('id', referrer.id)

  // Mark new workspace as referred
  await admin.from('workspaces').update({
    referred_by: referralCode.toUpperCase(),
  }).eq('id', newWorkspaceId)

  return NextResponse.json({ success: true })
}
