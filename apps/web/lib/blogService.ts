import { prisma } from './prisma';
import { BlogPostStatus } from '@prisma/client';
import { blogPosts as staticBlogPosts, BlogPost as StaticBlogPost, BlogPostSection } from './blogData';

// Type for unified blog post (works with both static and DB posts)
export type UnifiedBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: { sections: BlogPostSection[] };
  category: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  author: string;
  authorId: string;
  authorProfile?: {
    displayName: string | null;
    profileImageUrl: string | null;
    title: string | null;
  };
  keywords: string[];
  tags: string[];
  featuredImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  summary: string[];
  relatedPosts?: string[];
  faq?: Array<{ question: string; answer: string }>;
  sources?: Array<{ title: string; url?: string | null; description?: string | null }>;
  isFromDatabase: boolean;
};

// Convert static blog post to unified format
function staticToUnified(post: StaticBlogPost): UnifiedBlogPost {
  return {
    id: post.slug, // Use slug as ID for static posts
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: { sections: post.sections },
    category: post.category,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    readingTime: post.readingTime,
    author: post.author,
    authorId: post.authorId,
    keywords: post.keywords,
    tags: post.tags || [],
    featuredImage: post.featuredImage ? {
      src: post.featuredImage.src,
      alt: post.featuredImage.alt || post.title,
      width: post.featuredImage.width,
      height: post.featuredImage.height,
    } : undefined,
    summary: post.summary || [],
    relatedPosts: post.relatedPosts,
    faq: post.faq,
    isFromDatabase: false,
  };
}

// Convert DB blog post to unified format
function dbToUnified(post: Awaited<ReturnType<typeof getDbBlogPosts>>[0]): UnifiedBlogPost {
  const content = post.content as { sections?: BlogPostSection[] } || { sections: [] };

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: { sections: content.sections || [] },
    category: post.category || 'Allgemein',
    publishedAt: post.publishedAt?.toISOString().split('T')[0] || post.createdAt.toISOString().split('T')[0],
    updatedAt: post.updatedAt.toISOString().split('T')[0],
    readingTime: `${post.readingTimeMinutes || 5} Min.`,
    author: post.author.displayName || 'Therapeut:in',
    authorId: post.author.id,
    authorProfile: {
      displayName: post.author.displayName,
      profileImageUrl: post.author.profileImageUrl,
      title: post.author.title,
    },
    keywords: post.keywords,
    tags: post.tags,
    featuredImage: post.featuredImageUrl ? {
      src: post.featuredImageUrl,
      alt: post.featuredImageAlt || post.title,
      width: 1200,
      height: 630,
    } : undefined,
    summary: post.summaryPoints,
    relatedPosts: post.relatedFrom?.map(r => r.relatedPost.slug) || [],
    faq: post.faq as Array<{ question: string; answer: string }> | undefined,
    sources: 'sources' in post && post.sources ? post.sources.map(s => ({
      title: s.title,
      url: s.url,
      description: s.description,
    })) : undefined,
    isFromDatabase: true,
  };
}

// Get published blog posts from database
async function getDbBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            title: true,
          },
        },
        relatedFrom: {
          include: {
            relatedPost: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (error) {
    // Database not available (e.g., during CI build)
    console.warn('[BlogService] Database not available, returning empty array:', error);
    return [];
  }
}

// Get a single blog post from database by slug
async function getDbBlogPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: {
        slug,
        status: BlogPostStatus.PUBLISHED,
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            profileImageUrl: true,
            title: true,
          },
        },
        sources: {
          orderBy: { order: 'asc' },
        },
        relatedFrom: {
          include: {
            relatedPost: {
              select: {
                slug: true,
                title: true,
                excerpt: true,
                featuredImageUrl: true,
                category: true,
                publishedAt: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    // Database not available (e.g., during CI build)
    console.warn('[BlogService] Database not available for slug lookup:', slug, error);
    return null;
  }
}

// Get all published blog posts (static + database)
export async function getAllBlogPosts(): Promise<UnifiedBlogPost[]> {
  // Get DB posts
  const dbPosts = await getDbBlogPosts();
  const unifiedDbPosts = dbPosts.map(dbToUnified);

  // Get static posts
  const unifiedStaticPosts = staticBlogPosts.map(staticToUnified);

  // Combine and sort by publishedAt
  const allPosts = [...unifiedDbPosts, ...unifiedStaticPosts];
  allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return allPosts;
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<UnifiedBlogPost | null> {
  // First check database
  const dbPost = await getDbBlogPostBySlug(slug);
  if (dbPost) {
    return dbToUnified(dbPost);
  }

  // Fall back to static posts
  const staticPost = staticBlogPosts.find(p => p.slug === slug);
  if (staticPost) {
    return staticToUnified(staticPost);
  }

  return null;
}

// Get blog posts by category
export async function getBlogPostsByCategory(category: string): Promise<UnifiedBlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.category === category);
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<UnifiedBlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

// Get related posts for a given post
export async function getRelatedPosts(post: UnifiedBlogPost, limit = 3): Promise<UnifiedBlogPost[]> {
  const allPosts = await getAllBlogPosts();

  // If post has explicit related posts, use those first
  if (post.relatedPosts?.length) {
    const explicit = allPosts.filter(p =>
      p.slug !== post.slug && post.relatedPosts?.includes(p.slug)
    );
    if (explicit.length >= limit) {
      return explicit.slice(0, limit);
    }
  }

  // Otherwise, find posts from same category or with matching tags
  const related = allPosts
    .filter(p => p.slug !== post.slug)
    .map(p => {
      let score = 0;
      if (p.category === post.category) score += 10;
      for (const tag of post.tags) {
        if (p.tags.includes(tag)) score += 3;
      }
      for (const keyword of post.keywords) {
        if (p.keywords.includes(keyword)) score += 2;
      }
      return { post: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return related;
}

// Get all unique categories
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllBlogPosts();
  const categories = new Set(allPosts.map(post => post.category));
  return Array.from(categories).sort();
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllBlogPosts();
  const tags = new Set(allPosts.flatMap(post => post.tags));
  return Array.from(tags).sort();
}
