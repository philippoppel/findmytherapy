import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { captureError } from '@/lib/monitoring';
import { z } from 'zod';
import { sendEmail } from '@/lib/email/email-service';
import { generateLeadNotificationEmail } from '@/lib/email/templates/new-lead-notification';

const leadSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(100),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Nachricht muss mindestens 10 Zeichen lang sein').max(2000),
  consent: z.boolean().refine((val) => val === true, {
    message: 'Einwilligung ist erforderlich',
  }),
  metadata: z.record(z.any()).optional(),
});

type LeadInput = z.infer<typeof leadSchema>;

/**
 * POST /api/microsites/[slug]/leads
 * Public endpoint to submit a lead/contact request
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug ist erforderlich' },
        { status: 400 }
      );
    }

    // Find therapist profile
    const profile = await prisma.therapistProfile.findFirst({
      where: {
        micrositeSlug: slug,
        micrositeStatus: 'PUBLISHED',
        status: 'VERIFIED',
        deletedAt: null,
      },
      select: {
        id: true,
        displayName: true,
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Microsite nicht gefunden' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData: LeadInput = leadSchema.parse(body);

    // Create lead in database
    const lead = await prisma.therapistMicrositeLead.create({
      data: {
        therapistProfileId: profile.id,
        name: validatedData.name.trim(),
        email: validatedData.email.trim().toLowerCase(),
        phone: validatedData.phone?.trim() || null,
        message: validatedData.message.trim(),
        consent: validatedData.consent,
        metadata: validatedData.metadata || {},
        status: 'NEW',
      },
    });

    // Send notification email to therapist
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_BASE_URL || 'https://findmytherapy.com';
    const emailTemplate = generateLeadNotificationEmail({
      therapistName: profile.displayName || user.firstName || 'Therapeut',
      therapistEmail: user.email,
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone || undefined,
      leadMessage: lead.message,
      micrositeUrl: `${baseUrl}/t/${profile.micrositeSlug}`,
      leadsUrl: `${baseUrl}/dashboard/therapist/leads`,
    });

    // Send email (fire-and-forget, don't block lead creation)
    sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
      replyTo: lead.email, // Allow therapist to reply directly to lead
    }).catch((error) => {
      // Log error but don't fail the API call
      console.error('Failed to send lead notification email:', error);
      captureError(error, { location: 'api/microsites/[slug]/leads:email', leadId: lead.id });
    });

    console.log(`✅ New lead created for ${profile.displayName}: ${lead.id}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Ihre Anfrage wurde erfolgreich gesendet',
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    captureError(error, { location: 'api/microsites/[slug]/leads:post' });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validierungsfehler',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Anfrage konnte nicht gesendet werden' },
      { status: 500 }
    );
  }
}
