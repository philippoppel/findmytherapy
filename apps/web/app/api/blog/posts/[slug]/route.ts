import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blogService';

type RouteParams = { params: Promise<{ slug: string }> };

// GET - Get a single blog post by slug (public)
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const { slug } = await context.params;

    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: 'Post nicht gefunden' }, { status: 404 });
    }

    // Get related posts
    const relatedPosts = await getRelatedPosts(post, 3);

    return NextResponse.json({
      success: true,
      post,
      relatedPosts,
    });
  } catch (error) {
    console.error('[BLOG POST API] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden des Blog-Beitrags' },
      { status: 500 }
    );
  }
}
