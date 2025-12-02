import { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blogService';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog | FindMyTherapy',
  description: 'Artikel zu mentaler Gesundheit, Psychotherapie und Selbsthilfe in Österreich.',
  openGraph: {
    title: 'Blog | FindMyTherapy',
    description: 'Artikel zu mentaler Gesundheit, Psychotherapie und Selbsthilfe in Österreich.',
    type: 'website',
  },
};

// Revalidate every 60 seconds for fresh content
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  // Transform to simpler format for client
  const clientPosts = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    tags: post.tags,
    featuredImage: post.featuredImage,
  }));

  return <BlogPageClient initialPosts={clientPosts} />;
}
