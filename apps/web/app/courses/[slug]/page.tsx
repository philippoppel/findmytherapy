import { redirect } from 'next/navigation';
import { seedCourses } from '@/lib/seed-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return seedCourses
    .filter((course) => course.status === 'PUBLISHED')
    .map((course) => ({ slug: course.slug }));
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = seedCourses.find((c) => c.slug === slug && c.status === 'PUBLISHED');

  if (!course) {
    redirect('/courses');
  }

  // Redirect to courses overview for now - detail pages coming soon
  redirect('/courses');
}
