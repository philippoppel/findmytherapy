/**
 * Migration script to convert static blog posts to database entries
 * Run with: npx ts-node --skip-project scripts/migrate-static-blogs.ts
 */

import { PrismaClient, BlogPostStatus } from '@prisma/client';
import { blogPosts } from '../lib/blogData';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration of static blog posts...');
  console.log(`Found ${blogPosts.length} static posts to migrate\n`);

  // First, find or create an author for the static posts
  // We'll use the first therapist profile as the default author
  let defaultAuthor = await prisma.therapistProfile.findFirst({
    orderBy: { createdAt: 'asc' },
  });

  if (!defaultAuthor) {
    console.error('No therapist profile found. Please create one first.');
    process.exit(1);
  }

  console.log(`Using default author: ${defaultAuthor.displayName || defaultAuthor.id}\n`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const post of blogPosts) {
    try {
      // Check if post already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${post.title.slice(0, 50)}...`);
        skipped++;
        continue;
      }

      // Calculate reading time in minutes
      const readingTimeMinutes = parseInt(post.readingTime) || 5;

      // Create the blog post
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: { sections: post.sections },
          authorId: defaultAuthor.id,
          status: BlogPostStatus.PUBLISHED,
          publishedAt: new Date(post.publishedAt),
          featuredImageUrl: post.featuredImage?.src || null,
          featuredImageAlt: post.featuredImage?.alt || null,
          metaTitle: post.title,
          metaDescription: post.excerpt,
          keywords: post.keywords || [],
          tags: post.tags || [],
          category: post.category,
          readingTimeMinutes,
          summaryPoints: post.summary || [],
          faq: post.faq ? post.faq : undefined,
          viewCount: 0,
        },
      });

      console.log(`✅ Migrated: ${post.title.slice(0, 50)}...`);
      migrated++;
    } catch (error) {
      console.error(`❌ Error migrating "${post.title}":`, error);
      errors++;
    }
  }

  console.log('\n========================================');
  console.log('Migration complete!');
  console.log(`✅ Migrated: ${migrated}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Errors: ${errors}`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
