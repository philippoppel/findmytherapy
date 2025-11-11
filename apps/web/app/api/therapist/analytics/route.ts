import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { captureError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

/**
 * GET /api/therapist/analytics
 * Get analytics data for therapist microsite
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'THERAPIST') {
      return NextResponse.json(
        { success: false, message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const profile = await prisma.therapistProfile.findFirst({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        micrositeSlug: true,
        micrositeStatus: true,
        micrositeLastPublishedAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'Profil nicht gefunden' },
        { status: 404 }
      );
    }

    // Get date range (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch pageviews
    const [totalViews, viewsLast30Days, viewsLast7Days] = await Promise.all([
      prisma.therapistMicrositeVisit.count({
        where: { therapistProfileId: profile.id },
      }),
      prisma.therapistMicrositeVisit.count({
        where: {
          therapistProfileId: profile.id,
          occurredAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.therapistMicrositeVisit.count({
        where: {
          therapistProfileId: profile.id,
          occurredAt: { gte: sevenDaysAgo },
        },
      }),
    ]);

    // Fetch leads
    const [totalLeads, leadsLast30Days, leadsLast7Days, newLeadsCount] = await Promise.all([
      prisma.therapistMicrositeLead.count({
        where: { therapistProfileId: profile.id },
      }),
      prisma.therapistMicrositeLead.count({
        where: {
          therapistProfileId: profile.id,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.therapistMicrositeLead.count({
        where: {
          therapistProfileId: profile.id,
          createdAt: { gte: sevenDaysAgo },
        },
      }),
      prisma.therapistMicrositeLead.count({
        where: {
          therapistProfileId: profile.id,
          status: 'NEW',
        },
      }),
    ]);

    // Fetch daily pageviews for last 30 days (for chart)
    const dailyViews = await prisma.therapistMicrositeVisit.groupBy({
      by: ['occurredAt'],
      where: {
        therapistProfileId: profile.id,
        occurredAt: { gte: thirtyDaysAgo },
      },
      _count: {
        id: true,
      },
    });

    // Process daily views into date buckets
    const viewsByDate: Record<string, number> = {};
    dailyViews.forEach((view) => {
      const date = view.occurredAt.toISOString().split('T')[0];
      viewsByDate[date] = (viewsByDate[date] || 0) + view._count.id;
    });

    // Fill in missing dates with 0
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      chartData.push({
        date: dateStr,
        views: viewsByDate[dateStr] || 0,
      });
    }

    // Calculate conversion rate
    const conversionRate =
      viewsLast30Days > 0 ? ((leadsLast30Days / viewsLast30Days) * 100).toFixed(2) : '0.00';

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalViews,
          totalLeads,
          newLeadsCount,
          conversionRate: parseFloat(conversionRate),
          micrositeStatus: profile.micrositeStatus,
          publishedAt: profile.micrositeLastPublishedAt,
        },
        periods: {
          last7Days: {
            views: viewsLast7Days,
            leads: leadsLast7Days,
          },
          last30Days: {
            views: viewsLast30Days,
            leads: leadsLast30Days,
          },
        },
        chartData,
      },
    });
  } catch (error) {
    captureError(error, { location: 'api/therapist/analytics:get' });

    return NextResponse.json(
      { success: false, message: 'Fehler beim Laden der Analytics' },
      { status: 500 }
    );
  }
}
