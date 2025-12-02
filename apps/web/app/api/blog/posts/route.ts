import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts, getBlogPostsByCategory, getBlogPostsByTag } from '@/lib/blogService';

// GET - Get all published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '100');

    let posts;

    if (category) {
      posts = await getBlogPostsByCategory(category);
    } else if (tag) {
      posts = await getBlogPostsByTag(tag);
    } else {
      posts = await getAllBlogPosts();
    }

    // Apply limit
    posts = posts.slice(0, limit);

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error('[BLOG PUBLIC API] Error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Blog-Beiträge' },
      { status: 500 }
    );
  }
}
