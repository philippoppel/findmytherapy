import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@mental-health/db'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const requestSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = requestSchema.parse(body)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    })

    // For security, always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'Wenn ein Konto mit dieser E-Mail existiert, wurde ein Reset-Link gesendet.',
        },
        { status: 200 }
      )
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save password reset request
    await prisma.passwordResetRequest.create({
      data: {
        email: validated.email.toLowerCase(),
        token,
        expires,
        used: false,
      },
    })

    // In production, send email with reset link here
    // await sendPasswordResetEmail(user.email, token)

    console.log(`Password reset requested for: ${user.email}`)
    console.log(`Reset token: ${token}`)
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`)

    return NextResponse.json(
      {
        success: true,
        message: 'Reset-Link wurde versendet',
        // Include token in response for demo purposes only
        ...(process.env.NODE_ENV === 'development' && { token }),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing password reset request:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ungültige E-Mail-Adresse',
          errors: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    )
  }
}
