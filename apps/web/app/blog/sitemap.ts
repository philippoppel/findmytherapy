import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blogData'
import { getAllAuthors } from '@/lib/authors'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://findmytherapy.net'

  // Blog posts
  const posts = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Blog index
  const blogIndex = {
    url: `${baseUrl}/blog`,
    lastModified: blogPosts[0]?.publishedAt || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }

  // Categories
  const categories = Array.from(
    new Set(blogPosts.map((post) => post.category))
  ).map((category) => ({
    url: `${baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Authors
  const authors = getAllAuthors().map((author) => ({
    url: `${baseUrl}/blog/authors/${author.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [blogIndex, ...posts, ...categories, ...authors]
}
