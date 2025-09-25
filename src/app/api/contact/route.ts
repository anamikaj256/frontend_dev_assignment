import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body ?? {}

    // minimal server-side validation
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // TODO: integrate with an email provider, CRM, or database.
    // For now we'll log to server console (visible in terminal) to simulate processing.
    console.info('[Contact] message received:', { name, email, message })

    return NextResponse.json({ success: true, message: 'Received' }, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (err: any) {
    console.error('[Contact] error:', err)
    return NextResponse.json({ success: false, error: err?.message ?? 'Internal Server Error' }, { status: 500 })
  }
}
