import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlogPostStatus } from '@prisma/client';
import { blogPosts as staticBlogPosts } from '@/lib/blogData';

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => {
      const map: Record<string, string> = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
      return map[char] || char;
    })
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .substring(0, 100);
}

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

  // Average reading speed: 200 words per minute
  return Math.max(1, Math.ceil(wordCount / 200));
}

// GET - List all blog posts for the current therapist (or all posts if showAll=true)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    // Get therapist profile
    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapeutenprofil nicht gefunden' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as BlogPostStatus | null;
    const category = searchParams.get('category');
    const showAll = searchParams.get('showAll') === 'true';
    const includeStatic = searchParams.get('includeStatic') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = {
      // Only filter by author if showAll is false
      ...(showAll ? {} : { authorId: therapist.id }),
      deletedAt: null,
      ...(status && { status }),
      ...(category && { category }),
    };

    const [dbPosts, total, dbCategories] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          sources: { orderBy: { order: 'asc' } },
          images: { orderBy: { order: 'asc' } },
          author: {
            select: {
              id: true,
              displayName: true,
              profileImageUrl: true,
            },
          },
          _count: {
            select: {
              relatedFrom: true,
            },
          },
        },
      }),
      prisma.blogPost.count({ where }),
      // Get all unique categories for filter dropdown
      prisma.blogPost.findMany({
        where: { deletedAt: null },
        select: { category: true },
        distinct: ['category'],
      }),
    ]);

    // Convert DB posts to response format with isStatic flag
    const posts = dbPosts.map((post) => ({
      ...post,
      isStatic: false,
    }));

    // Include static posts if requested
    if (includeStatic && showAll) {
      // Convert static posts to match DB post format
      const staticPostsFormatted = staticBlogPosts
        .filter((sp) => {
          // Apply status filter (static posts are always "published")
          if (status && status !== 'PUBLISHED') return false;
          // Apply category filter
          if (category && sp.category !== category) return false;
          return true;
        })
        .map((sp) => ({
          id: `static-${sp.slug}`,
          slug: sp.slug,
          title: sp.title,
          excerpt: sp.excerpt,
          status: 'PUBLISHED' as BlogPostStatus,
          featuredImageUrl: sp.featuredImage?.src || null,
          category: sp.category,
          publishedAt: sp.publishedAt,
          updatedAt: sp.updatedAt || sp.publishedAt,
          readingTimeMinutes: parseInt(sp.readingTime) || 5,
          viewCount: 0,
          author: {
            id: sp.authorId,
            displayName: sp.author,
            profileImageUrl: null,
          },
          _count: { relatedFrom: 0 },
          isStatic: true,
        }));

      // Combine and sort by date
      posts.push(...staticPostsFormatted);
      posts.sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });
    }

    // Extract unique category names (from DB + static)
    const allCategories = new Set<string>();
    dbCategories.forEach((c) => {
      if (c.category) allCategories.add(c.category);
    });
    if (includeStatic) {
      staticBlogPosts.forEach((sp) => allCategories.add(sp.category));
    }
    const uniqueCategories = Array.from(allCategories).sort();

    return NextResponse.json({
      success: true,
      posts,
      categories: uniqueCategories,
      pagination: {
        page,
        limit,
        total: includeStatic && showAll ? total + staticBlogPosts.length : total,
        totalPages: Math.ceil((includeStatic && showAll ? total + staticBlogPosts.length : total) / limit),
      },
    });
  } catch (error) {
    console.error('[BLOG API] Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Blog-Beiträge' },
      { status: 500 }
    );
  }
}

// POST - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
    }

    // Get therapist profile
    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapeutenprofil nicht gefunden' }, { status: 404 });
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

    // Validate required fields
    if (!title || !excerpt) {
      return NextResponse.json(
        { error: 'Titel und Auszug sind erforderlich' },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate reading time
    const readingTimeMinutes = calculateReadingTime(content);

    // Determine status
    let status: BlogPostStatus = BlogPostStatus.DRAFT;
    if (requestedStatus === 'PENDING_REVIEW') {
      status = BlogPostStatus.PENDING_REVIEW;
    }

    // Use requested author if provided (and valid), otherwise use logged-in therapist
    let authorId = therapist.id;
    if (requestedAuthorId) {
      const requestedAuthor = await prisma.therapistProfile.findUnique({
        where: { id: requestedAuthorId },
      });
      if (requestedAuthor) {
        authorId = requestedAuthorId;
      }
    }

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content: content || { sections: [] },
        authorId,
        status,
        featuredImageUrl,
        featuredImageAlt,
        featuredImageCaption,
        metaTitle,
        metaDescription,
        keywords: keywords || [],
        tags: tags || [],
        category,
        readingTimeMinutes,
        summaryPoints: summaryPoints || [],
        faq,
        // Create sources
        sources: sources?.length
          ? {
              create: sources.map((s: { title: string; url?: string; description?: string }, idx: number) => ({
                title: s.title,
                url: s.url,
                description: s.description,
                order: idx,
              })),
            }
          : undefined,
        // Create images
        images: images?.length
          ? {
              create: images.map((img: { url: string; alt?: string; caption?: string; isUploaded?: boolean; width?: number; height?: number }, idx: number) => ({
                url: img.url,
                alt: img.alt,
                caption: img.caption,
                isUploaded: img.isUploaded || false,
                width: img.width,
                height: img.height,
                order: idx,
              })),
            }
          : undefined,
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

    // Create manual related post relations if provided
    if (relatedPostIds?.length) {
      await prisma.blogPostRelation.createMany({
        data: relatedPostIds.map((relatedId: string, idx: number) => ({
          sourcePostId: post.id,
          relatedPostId: relatedId,
          isManual: true,
          order: idx,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('[BLOG API] Error creating post:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Blog-Beitrags' },
      { status: 500 }
    );
  }
}
