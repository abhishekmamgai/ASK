import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactFormData

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const ADMIN_EMAIL = 'infoasktechbusiness@gmail.com'

    // Log the contact form submission (in production, send email or save to database)
    console.log('[v0] Contact form submission received:', {
      name: body.name,
      email: body.email,
      message: body.message,
      timestamp: new Date().toISOString(),
      sendingTo: ADMIN_EMAIL,
    })

    // TODO: In production, implement:
    // 1. Send email notification to admin at infoasktechbusiness@gmail.com
    // 2. Send confirmation email to user
    // 3. Save to database
    // 4. Integrate with email service (SendGrid, Resend, etc.)

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}
