import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST - Increment view count for a blog post
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Try to update view count in database
    const post = await prisma.blogPost.updateMany({
      where: {
        slug,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    if (post.count === 0) {
      // Post not found in database - might be a static post
      return NextResponse.json({ success: true, isStatic: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BLOG VIEW API] Error:', error);
    // Don't fail the request for view tracking errors
    return NextResponse.json({ success: false });
  }
}
