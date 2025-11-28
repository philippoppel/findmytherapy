import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { seedAccounts, seedCourses, seedTherapists } from './seed-data';

const prisma = new PrismaClient();

const passwordCache = new Map<string, string>();

const hashPassword = async (password: string) => {
  if (passwordCache.has(password)) {
    return passwordCache.get(password)!;
  }

  const hashed = await bcrypt.hash(password, 10);
  passwordCache.set(password, hashed);
  return hashed;
};

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.emergencyAlert.deleteMany();
  await prisma.match.deleteMany();
  await prisma.triageSession.deleteMany();
  await prisma.triageSnapshot.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.therapistProfile.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: seedAccounts.admin.email,
      emailVerified: new Date(),
      passwordHash: await hashPassword(seedAccounts.admin.password),
      role: seedAccounts.admin.role,
      locale: seedAccounts.admin.locale,
      firstName: seedAccounts.admin.firstName,
      lastName: seedAccounts.admin.lastName,
      marketingOptIn: false,
    },
  });

  const client = await prisma.user.create({
    data: {
      email: seedAccounts.client.email,
      emailVerified: new Date(),
      passwordHash: await hashPassword(seedAccounts.client.password),
      role: seedAccounts.client.role,
      locale: seedAccounts.client.locale,
      firstName: seedAccounts.client.firstName,
      lastName: seedAccounts.client.lastName,
      marketingOptIn: true,
    },
  });

  const therapistMap = new Map<
    string,
    {
      userId: string;
      profileId: string;
    }
  >();

  for (const therapist of seedTherapists) {
    const created = await prisma.user.create({
      data: {
        email: therapist.email,
        emailVerified: new Date(),
        passwordHash: await hashPassword(therapist.password),
        role: 'THERAPIST',
        locale: 'de-AT',
        firstName: therapist.firstName,
        lastName: therapist.lastName,
        marketingOptIn: false,
        therapistProfile: {
          create: {
            status: therapist.profile.status,
            licenseAuthority: therapist.profile.licenseAuthority,
            licenseId: therapist.profile.licenseId,
            displayName: therapist.displayName,
            title: therapist.title,
            headline: therapist.headline,
            profileImageUrl: therapist.image,
            approachSummary: therapist.approach,
            experienceSummary: therapist.experience,
            services: therapist.services,
            videoUrl: therapist.videoUrl ?? null,
            acceptingClients: therapist.acceptingClients,
            yearsExperience: therapist.yearsExperience,
            rating: therapist.rating,
            reviewCount: therapist.reviews,
            responseTime: therapist.responseTime,
            modalities: therapist.profile.modalities,
            specialties: therapist.profile.specialties,
            priceMin: therapist.profile.priceMin,
            priceMax: therapist.profile.priceMax,
            languages: therapist.profile.languages,
            online: therapist.profile.online,
            city: therapist.profile.city,
            latitude: therapist.profile.latitude ?? null,
            longitude: therapist.profile.longitude ?? null,
            country: therapist.profile.country,
            about: therapist.profile.about,
            availabilityNote: therapist.profile.availabilityNote,
            pricingNote: therapist.profile.pricingNote,
            isPublic: therapist.profile.isPublic,
            // Filter-relevant fields
            gender: therapist.profile.gender,
            acceptedInsurance: therapist.profile.acceptedInsurance,
            ageGroups: therapist.profile.ageGroups,
            availabilityStatus: therapist.profile.availabilityStatus,
            estimatedWaitWeeks: therapist.profile.estimatedWaitWeeks,
          },
        },
      },
      include: {
        therapistProfile: true,
      },
    });

    if (created.therapistProfile) {
      therapistMap.set(therapist.email, {
        userId: created.id,
        profileId: created.therapistProfile.id,
      });

      await prisma.therapistProfileVersion.create({
        data: {
          profileId: created.therapistProfile.id,
          authorId: created.id,
          data: {
            displayName: created.therapistProfile.displayName,
            title: created.therapistProfile.title,
            headline: created.therapistProfile.headline,
            approachSummary: created.therapistProfile.approachSummary,
            experienceSummary: created.therapistProfile.experienceSummary,
            services: created.therapistProfile.services,
            profileImageUrl: created.therapistProfile.profileImageUrl,
            videoUrl: created.therapistProfile.videoUrl,
            acceptingClients: created.therapistProfile.acceptingClients,
            yearsExperience: created.therapistProfile.yearsExperience,
            rating: created.therapistProfile.rating,
            reviewCount: created.therapistProfile.reviewCount,
            responseTime: created.therapistProfile.responseTime,
            modalities: created.therapistProfile.modalities,
            specialties: created.therapistProfile.specialties,
            languages: created.therapistProfile.languages,
            priceMin: created.therapistProfile.priceMin,
            priceMax: created.therapistProfile.priceMax,
            about: created.therapistProfile.about,
            availabilityNote: created.therapistProfile.availabilityNote,
            pricingNote: created.therapistProfile.pricingNote,
            online: created.therapistProfile.online,
            city: created.therapistProfile.city,
            country: created.therapistProfile.country,
          },
        },
      });

      if (therapist.listing) {
        await prisma.listing.create({
          data: {
            therapistId: created.therapistProfile.id,
            plan: therapist.listing.plan,
            status: therapist.listing.status,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }
  }

  const createdCourses = [];

  for (const course of seedCourses) {
    const author = therapistMap.get(course.therapistEmail);
    if (!author) {
      continue;
    }

    const createdCourse = await prisma.course.create({
      data: {
        therapistId: author.profileId,
        title: course.title,
        slug: course.slug,
        description: course.description,
        price: course.price,
        currency: course.currency,
        status: course.status,
        mediaManifest: course.mediaManifest,
      },
    });

    createdCourses.push(createdCourse);

    for (const [index, lesson] of course.lessons.entries()) {
      await prisma.lesson.create({
        data: {
          courseId: createdCourse.id,
          title: lesson.title,
          durationSec: lesson.durationSec,
          order: index + 1,
          assetRef: `courses/${createdCourse.id}/lesson-${index + 1}.mp4`,
        },
      });
    }
  }

  if (createdCourses.length > 0) {
    const primaryCourse = createdCourses[0];
    await prisma.enrollment.create({
      data: {
        clientId: client.id,
        courseId: primaryCourse.id,
      },
    });

    await prisma.order.create({
      data: {
        buyerId: client.id,
        type: 'COURSE',
        amount: primaryCourse.price,
        currency: primaryCourse.currency,
        status: 'PAID',
        metadata: {
          courseId: primaryCourse.id,
          courseTitle: primaryCourse.title,
        },
      },
    });
  }

  await prisma.triageSession.create({
    data: {
      clientId: client.id,
      phq9Score: 8,
      gad7Score: 10,
      riskLevel: 'MEDIUM',
      recommendedNextStep: 'THERAPIST',
      meta: {
        completedAt: new Date().toISOString(),
        recommendedTherapists: seedTherapists.length,
      },
    },
  });

  const firstTherapist = therapistMap.get(seedTherapists[0]?.email ?? '');
  const secondTherapist = therapistMap.get(seedTherapists[1]?.email ?? '');

  if (firstTherapist) {
    await prisma.match.create({
      data: {
        clientId: client.id,
        therapistId: firstTherapist.profileId,
        score: 0.85,
        reason: ['Spezialisierung passt', 'Online-Therapie verfügbar', 'Sprache: Deutsch'],
        status: 'NEW',
      },
    });
  }

  if (secondTherapist) {
    await prisma.match.create({
      data: {
        clientId: client.id,
        therapistId: secondTherapist.profileId,
        score: 0.72,
        reason: ['Traumatherapie-Erfahrung', 'Passende Preisrange'],
        status: 'NEW',
      },
    });
  }

  // Create sample appointments for first therapist
  if (firstTherapist) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 30, 0, 0);

    await prisma.appointment.create({
      data: {
        therapistId: firstTherapist.profileId,
        clientId: client.id,
        title: 'Erstgespräch',
        description: 'Erstes Kennenlernen und Zieldefinition',
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000), // 1 hour
        status: 'CONFIRMED',
        location: 'online',
        meetingLink: 'https://meet.example.com/room-abc123',
      },
    });

    await prisma.appointment.create({
      data: {
        therapistId: firstTherapist.profileId,
        clientId: client.id,
        title: 'Folgesitzung',
        description: 'Vertiefung der Themen aus dem Erstgespräch',
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 60 * 60 * 1000), // 1 hour
        status: 'SCHEDULED',
        location: 'online',
        meetingLink: 'https://meet.example.com/room-xyz789',
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'SEED_DATABASE',
      entity: 'System',
      entityId: 'seed-script',
      ip: '127.0.0.1',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Login credentials:');
  console.log(`${seedAccounts.admin.email} / ${seedAccounts.admin.password}`);
  console.log(`${seedAccounts.client.email} / ${seedAccounts.client.password}`);
  seedTherapists.forEach((therapist) => {
    console.log(`${therapist.email} / ${therapist.password}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
