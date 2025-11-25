import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTherapistData() {
  try {
    // First check total count
    const totalCount = await prisma.therapistProfile.count();
    const verifiedCount = await prisma.therapistProfile.count({
      where: { status: 'VERIFIED' },
    });
    const publicCount = await prisma.therapistProfile.count({
      where: { isPublic: true },
    });

    console.log(`Total therapists: ${totalCount}`);
    console.log(`Verified therapists: ${verifiedCount}`);
    console.log(`Public therapists: ${publicCount}`);
    console.log(
      `Public & Verified: `,
      await prisma.therapistProfile.count({
        where: { isPublic: true, status: 'VERIFIED' },
      }),
    );
    console.log('\n');

    const therapists = await prisma.therapistProfile.findMany({
      where: {
        isPublic: true,
        status: 'VERIFIED',
      },
      select: {
        id: true,
        displayName: true,
        specialties: true,
        languages: true,
        online: true,
        modalities: true,
        acceptedInsurance: true,
        yearsExperience: true,
        ageGroups: true,
        services: true,
        qualifications: true,
      },
      take: 5,
    });

    console.log(`Found ${therapists.length} therapists\n`);

    therapists.forEach((t, i) => {
      console.log(`\n=== Therapist ${i + 1}: ${t.displayName} ===`);
      console.log(`ID: ${t.id}`);
      console.log(`Specialties: ${JSON.stringify(t.specialties)}`);
      console.log(`Languages: ${JSON.stringify(t.languages)}`);
      console.log(`Online: ${t.online}`);
      console.log(`Modalities: ${JSON.stringify(t.modalities)}`);
      console.log(`Insurance: ${JSON.stringify(t.acceptedInsurance)}`);
      console.log(`Years: ${t.yearsExperience}`);
      console.log(`Age Groups: ${JSON.stringify(t.ageGroups)}`);
      console.log(`Services: ${JSON.stringify(t.services)}`);
      console.log(`Qualifications: ${JSON.stringify(t.qualifications)}`);
    });

    // Count missing fields
    const stats = {
      missingSpecialties: therapists.filter((t) => !t.specialties || t.specialties.length === 0)
        .length,
      missingLanguages: therapists.filter((t) => !t.languages || t.languages.length === 0).length,
      missingModalities: therapists.filter((t) => !t.modalities || t.modalities.length === 0)
        .length,
      missingInsurance: therapists.filter(
        (t) => !t.acceptedInsurance || t.acceptedInsurance.length === 0,
      ).length,
      missingAgeGroups: therapists.filter((t) => !t.ageGroups || t.ageGroups.length === 0).length,
      missingServices: therapists.filter((t) => !t.services || t.services.length === 0).length,
    };

    console.log('\n\n=== Statistics ===');
    console.log(`Missing Specialties: ${stats.missingSpecialties}/${therapists.length}`);
    console.log(`Missing Languages: ${stats.missingLanguages}/${therapists.length}`);
    console.log(`Missing Modalities: ${stats.missingModalities}/${therapists.length}`);
    console.log(`Missing Insurance: ${stats.missingInsurance}/${therapists.length}`);
    console.log(`Missing Age Groups: ${stats.missingAgeGroups}/${therapists.length}`);
    console.log(`Missing Services: ${stats.missingServices}/${therapists.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTherapistData();
