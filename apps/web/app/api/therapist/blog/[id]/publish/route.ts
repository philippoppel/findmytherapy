import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlogPostStatus } from '@prisma/client';

type RouteParams = { params: Promise<{ id: string }> };

// POST - Publish a blog post
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    const { id } = await context.params;

    // Get therapist profile
    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapeutenprofil nicht gefunden' }, { status: 404 });
    }

    // Check if post exists and belongs to therapist
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        id,
        authorId: therapist.id,
        deletedAt: null,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Blog-Beitrag nicht gefunden' }, { status: 404 });
    }

    // Validate post has required fields for publishing
    if (!existingPost.title || !existingPost.excerpt) {
      return NextResponse.json(
        { error: 'Titel und Auszug sind für die Veröffentlichung erforderlich' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { scheduleFor } = body;

    // Update to published or scheduled
    const updateData: {
      status: BlogPostStatus;
      publishedAt?: Date;
      scheduledFor?: Date | null;
    } = {
      status: BlogPostStatus.PUBLISHED,
      publishedAt: new Date(),
      scheduledFor: null,
    };

    // If scheduling for later
    if (scheduleFor) {
      const scheduledDate = new Date(scheduleFor);
      if (scheduledDate > new Date()) {
        updateData.status = existingPost.status; // Keep current status
        updateData.scheduledFor = scheduledDate;
        delete updateData.publishedAt;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post,
      message: scheduleFor && new Date(scheduleFor) > new Date()
        ? 'Blog-Beitrag wurde geplant'
        : 'Blog-Beitrag wurde veröffentlicht',
    });
  } catch (error) {
    console.error('[BLOG API] Error publishing post:', error);
    return NextResponse.json(
      { error: 'Fehler beim Veröffentlichen des Blog-Beitrags' },
      { status: 500 }
    );
  }
}

// DELETE - Unpublish a blog post
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    const { id } = await context.params;

    // Get therapist profile
    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapeutenprofil nicht gefunden' }, { status: 404 });
    }

    // Check if post exists and belongs to therapist
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        id,
        authorId: therapist.id,
        deletedAt: null,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Blog-Beitrag nicht gefunden' }, { status: 404 });
    }

    // Set back to draft
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        status: BlogPostStatus.DRAFT,
        scheduledFor: null,
      },
    });

    return NextResponse.json({
      success: true,
      post,
      message: 'Blog-Beitrag wurde zurückgezogen',
    });
  } catch (error) {
    console.error('[BLOG API] Error unpublishing post:', error);
    return NextResponse.json(
      { error: 'Fehler beim Zurückziehen des Blog-Beitrags' },
      { status: 500 }
    );
  }
}
