import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/libs/supabaseAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.userId) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { name, description, icon_url } = await req.json()

    if (!name || !description) {
      return NextResponse.json(
        { error: 'name and description required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('tech_requests').insert({
      name,
      description,
      icon_url: icon_url || null,
      user_id: session.user.userId,
      status: 'pending',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('tech request error FULL:', e)
    return NextResponse.json(
      {
        error: e?.message,
        details: e,
      },
      { status: 500 }
    )
  }
}
