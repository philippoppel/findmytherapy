import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlogPostStatus } from '@prisma/client';

// GET - Get related posts suggestions based on keywords/tags/category
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const keywords = searchParams.get('keywords')?.split(',').filter(Boolean) || [];
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get published posts that match
    const posts = await prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        deletedAt: null,
        ...(postId && { NOT: { id: postId } }),
        OR: [
          // Match by category
          ...(category ? [{ category }] : []),
          // Match by keywords
          ...(keywords.length > 0
            ? [{ keywords: { hasSome: keywords } }]
            : []),
          // Match by tags
          ...(tags.length > 0 ? [{ tags: { hasSome: tags } }] : []),
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: limit * 2, // Get more to score and filter
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featuredImageUrl: true,
        featuredImageAlt: true,
        category: true,
        keywords: true,
        tags: true,
        publishedAt: true,
        readingTimeMinutes: true,
        author: {
          select: {
            displayName: true,
            profileImageUrl: true,
          },
        },
      },
    });

    // Score posts by relevance
    const scoredPosts = posts.map((post) => {
      let score = 0;

      // Category match
      if (category && post.category === category) {
        score += 10;
      }

      // Keyword matches
      for (const kw of keywords) {
        if (post.keywords.includes(kw)) score += 5;
      }

      // Tag matches
      for (const tag of tags) {
        if (post.tags.includes(tag)) score += 3;
      }

      return { ...post, score };
    });

    // Sort by score and take top results
    const sortedPosts = scoredPosts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score: _score, ...post }) => post);

    return NextResponse.json({
      success: true,
      posts: sortedPosts,
    });
  } catch (error) {
    console.error('[BLOG RELATED API] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden verwandter Beiträge' },
      { status: 500 }
    );
  }
}
