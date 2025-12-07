import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/auth-guards';
import { ClientDashboardContent } from './ClientDashboardContent';

// Force dynamic rendering for auth-protected page
export const dynamic = 'force-dynamic';

const fetchClientData = async (userId: string) => {
  const [enrollments, orders, matches, triageSession] = await Promise.all([
    prisma.enrollment.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
            status: true,
            lessons: {
              select: {
                id: true,
              },
            },
            therapist: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
                city: true,
              },
            },
          },
        },
      },
    }),
    prisma.order.findMany({
      where: { buyerId: userId, type: 'COURSE' },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.match.findMany({
      where: { clientId: userId },
      orderBy: { score: 'desc' },
      take: 3,
      include: {
        therapist: {
          select: {
            specialties: true,
            city: true,
            priceMin: true,
            priceMax: true,
            status: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.triageSession.findFirst({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { enrollments, orders, matches, triageSession };
};

export default async function ClientDashboardPage() {
  const session = await requireClient();
  const { enrollments, orders, matches, triageSession } = await fetchClientData(session.user.id);

  const firstName =
    typeof session.user.firstName === 'string' && session.user.firstName.length > 0
      ? session.user.firstName
      : session.user.email.split('@')[0];

  return (
    <ClientDashboardContent
      firstName={firstName}
      enrollments={enrollments}
      orders={orders}
      matches={matches}
      triageSession={triageSession}
    />
  );
}
