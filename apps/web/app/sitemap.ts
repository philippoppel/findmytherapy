import { MetadataRoute } from 'next'
import { blogPosts } from '../lib/blogData'
import { prisma } from '@/lib/prisma'
import { austrianCities } from '@/lib/seo/cities'
import { mentalHealthConditions } from '@/lib/seo/conditions'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://findmytherapy.net'
  const currentDate = new Date()

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/triage`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/therapists`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-therapists`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/imprint`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic blog post pages
  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Blog category pages
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog author pages
  const authorIds = Array.from(new Set(blogPosts.map((post) => post.authorId)))
  const authorPages: MetadataRoute.Sitemap = authorIds.map((authorId) => ({
    url: `${baseUrl}/blog/authors/${authorId}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic therapist profile pages (microsites and regular profiles)
  let therapistPages: MetadataRoute.Sitemap = []
  try {
    const therapists = await prisma.therapistProfile.findMany({
      where: {
        status: 'VERIFIED',
        isPublic: true,
        deletedAt: null,
      },
      select: {
        id: true,
        updatedAt: true,
        micrositeSlug: true,
        micrositeStatus: true,
      },
    })

    therapistPages = therapists.map((t) => ({
      url: t.micrositeSlug && t.micrositeStatus === 'PUBLISHED'
        ? `${baseUrl}/t/${t.micrositeSlug}`
        : `${baseUrl}/therapists/${t.id}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.warn('Could not fetch therapists for sitemap:', error)
  }

  // City landing pages for SEO
  const cityPages: MetadataRoute.Sitemap = austrianCities.map((city) => ({
    url: `${baseUrl}/stadt/${city.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Condition/topic landing pages for SEO
  const conditionPages: MetadataRoute.Sitemap = mentalHealthConditions.map((condition) => ({
    url: `${baseUrl}/themen/${condition.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [...staticPages, ...blogPostPages, ...categoryPages, ...authorPages, ...therapistPages, ...cityPages, ...conditionPages]
}
