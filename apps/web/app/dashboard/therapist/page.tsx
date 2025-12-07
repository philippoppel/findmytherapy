import { prisma } from '@/lib/prisma';
import { requireTherapist } from '@/lib/auth-guards';
import { TherapistDashboardClient } from './components/TherapistDashboardClient';
import { TherapistDashboardContent } from './components/TherapistDashboardContent';
import { GettingStartedWidget } from './components/GettingStartedWidget';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const fetchTherapistProfile = async (userId: string) => {
  const profile = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: {
      listings: true,
      courses: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
      appointments: {
        where: {
          startTime: {
            gte: new Date(),
          },
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 5,
        include: {
          client: {
            select: {
              email: true,
            },
          },
        },
      },
      micrositeLeads: {
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  return profile;
};

export default async function TherapistDashboardPage() {
  const session = await requireTherapist();
  const profile = await fetchTherapistProfile(session.user.id);

  // Calculate Getting Started checklist values
  const profileComplete = Boolean(
    profile?.headline &&
      profile?.experienceSummary &&
      profile?.specialties &&
      profile.specialties.length >= 3,
  );
  const micrositePublished = profile?.micrositeStatus === 'PUBLISHED';
  const hasLeads = (profile?.micrositeLeads?.length ?? 0) > 0;

  // Serialize data for client component
  const appointments = (profile?.appointments ?? []).map((apt) => ({
    id: apt.id,
    title: apt.title,
    startTime: apt.startTime.toISOString(),
    status: apt.status,
    client: apt.client ? { email: apt.client.email } : null,
  }));

  const courses = (profile?.courses ?? []).map((course) => ({
    id: course.id,
    title: course.title,
    status: course.status,
  }));

  const listings = (profile?.listings ?? []).map((listing) => ({
    plan: listing.plan,
    status: listing.status,
  }));

  return (
    <div className="space-y-8">
      <TherapistDashboardClient />
      <TherapistDashboardContent
        userName={session.user.firstName || session.user.email}
        profileStatus={profile?.status ?? null}
        appointments={appointments}
        courses={courses}
        listings={listings}
        appointmentCount={profile?.appointments.length ?? 0}
        publishedCoursesCount={profile?.courses.filter((c) => c.status === 'PUBLISHED').length ?? 0}
      />
      {/* Getting Started Widget */}
      <GettingStartedWidget
        profileComplete={profileComplete}
        micrositePublished={micrositePublished}
        hasLeads={hasLeads}
      />
    </div>
  );
}
