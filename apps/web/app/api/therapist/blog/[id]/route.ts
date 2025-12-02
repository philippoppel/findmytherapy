import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlogPostStatus } from '@prisma/client';

type RouteParams = { params: Promise<{ id: string }> };

// Calculate reading time from content
function calculateReadingTime(content: unknown): number {
  if (!content || typeof content !== 'object') return 5;

  let wordCount = 0;
  const sections = (content as { sections?: Array<{ paragraphs?: string[]; list?: string[] }> }).sections || [];

  for (const section of sections) {
    if (section.paragraphs) {
      for (const p of section.paragraphs) {
        wordCount += p.split(/\s+/).length;
      }
    }
    if (section.list) {
      for (const item of section.list) {
        wordCount += item.split(/\s+/).length;
      }
    }
  }

  return Math.max(1, Math.ceil(wordCount / 200));
}

// GET - Get a single blog post
export async function GET(request: NextRequest, context: RouteParams) {
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

    const post = await prisma.blogPost.findFirst({
      where: {
        id,
        authorId: therapist.id,
        deletedAt: null,
      },
      include: {
        sources: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        relatedFrom: {
          include: {
            relatedPost: {
              select: {
                id: true,
                slug: true,
                title: true,
                excerpt: true,
                featuredImageUrl: true,
                status: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            title: true,
          },
        },
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog-Beitrag nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('[BLOG API] Error fetching post:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden des Blog-Beitrags' },
      { status: 500 }
    );
  }
}

// PUT - Update a blog post
export async function PUT(request: NextRequest, context: RouteParams) {
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

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      featuredImageUrl,
      featuredImageAlt,
      featuredImageCaption,
      metaTitle,
      metaDescription,
      keywords,
      tags,
      category,
      summaryPoints,
      faq,
      sources,
      images,
      relatedPostIds,
      status: requestedStatus,
      authorId: requestedAuthorId,
    } = body;

    // Calculate reading time
    const readingTimeMinutes = content ? calculateReadingTime(content) : existingPost.readingTimeMinutes;

    // Determine status change
    let status = existingPost.status;
    if (requestedStatus === 'PENDING_REVIEW' && existingPost.status === BlogPostStatus.DRAFT) {
      status = BlogPostStatus.PENDING_REVIEW;
    } else if (requestedStatus === 'DRAFT') {
      status = BlogPostStatus.DRAFT;
    }

    // Validate author if provided
    let authorId: string | undefined;
    if (requestedAuthorId) {
      const requestedAuthor = await prisma.therapistProfile.findUnique({
        where: { id: requestedAuthorId },
      });
      if (requestedAuthor) {
        authorId = requestedAuthorId;
      }
    }

    // Update the blog post
    await prisma.blogPost.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(featuredImageUrl !== undefined && { featuredImageUrl }),
        ...(featuredImageAlt !== undefined && { featuredImageAlt }),
        ...(featuredImageCaption !== undefined && { featuredImageCaption }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(keywords && { keywords }),
        ...(tags && { tags }),
        ...(category !== undefined && { category }),
        ...(readingTimeMinutes && { readingTimeMinutes }),
        ...(summaryPoints && { summaryPoints }),
        ...(faq !== undefined && { faq }),
        ...(authorId && { authorId }),
        status,
      },
      include: {
        sources: true,
        images: true,
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Update sources if provided
    if (sources !== undefined) {
      // Delete existing sources
      await prisma.blogSource.deleteMany({ where: { postId: id } });

      // Create new sources
      if (sources.length > 0) {
        await prisma.blogSource.createMany({
          data: sources.map((s: { title: string; url?: string; description?: string }, idx: number) => ({
            postId: id,
            title: s.title,
            url: s.url,
            description: s.description,
            order: idx,
          })),
        });
      }
    }

    // Update images if provided
    if (images !== undefined) {
      // Delete existing images
      await prisma.blogImage.deleteMany({ where: { postId: id } });

      // Create new images
      if (images.length > 0) {
        await prisma.blogImage.createMany({
          data: images.map((img: { url: string; alt?: string; caption?: string; isUploaded?: boolean; width?: number; height?: number }, idx: number) => ({
            postId: id,
            url: img.url,
            alt: img.alt,
            caption: img.caption,
            isUploaded: img.isUploaded || false,
            width: img.width,
            height: img.height,
            order: idx,
          })),
        });
      }
    }

    // Update related posts if provided
    if (relatedPostIds !== undefined) {
      // Delete existing manual relations
      await prisma.blogPostRelation.deleteMany({
        where: { sourcePostId: id, isManual: true },
      });

      // Create new relations
      if (relatedPostIds.length > 0) {
        await prisma.blogPostRelation.createMany({
          data: relatedPostIds.map((relatedId: string, idx: number) => ({
            sourcePostId: id,
            relatedPostId: relatedId,
            isManual: true,
            order: idx,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Fetch updated post with all relations
    const updatedPost = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        sources: { orderBy: { order: 'asc' } },
        images: { orderBy: { order: 'asc' } },
        relatedFrom: {
          include: {
            relatedPost: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('[BLOG API] Error updating post:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Blog-Beitrags' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete a blog post
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

    // Soft delete
    await prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BLOG API] Error deleting post:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Blog-Beitrags' },
      { status: 500 }
    );
  }
}
