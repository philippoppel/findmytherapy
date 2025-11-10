#!/usr/bin/env tsx
/**
 * Migration script to generate slugs for existing therapist profiles
 * Run with: pnpm tsx scripts/generate-therapist-slugs.ts
 */

import { PrismaClient } from "@prisma/client";
import { generateUniqueSlug } from "../src/slug-generator";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting slug generation for existing therapist profiles...\n");

  // Get all therapist profiles without a slug
  const profiles = await prisma.therapistProfile.findMany({
    where: {
      micrositeSlug: null,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(`Found ${profiles.length} profiles without slugs\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const profile of profiles) {
    try {
      // Generate slug from user's name
      const slug = await generateUniqueSlug(
        prisma,
        profile.user.firstName,
        profile.user.lastName,
        profile.id
      );

      // Update profile with generated slug
      await prisma.therapistProfile.update({
        where: { id: profile.id },
        data: { micrositeSlug: slug },
      });

      console.log(
        `✅ ${profile.displayName || profile.user.email}: ${slug}`
      );
      successCount++;
    } catch (error) {
      console.error(
        `❌ Error generating slug for ${profile.displayName || profile.user.email}:`,
        error
      );
      errorCount++;
    }
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
}

main()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
