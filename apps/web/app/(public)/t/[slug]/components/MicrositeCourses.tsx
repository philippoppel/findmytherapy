import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
}

interface MicrositeCoursesProps {
  courses: Course[];
  therapistName: string;
}

export function MicrositeCourses({ courses, therapistName }: MicrositeCoursesProps) {
  if (!courses || courses.length === 0) {
    return null;
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: currency,
    }).format(price / 100); // Convert from cents
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Online-Kurse</h2>
      <p className="text-gray-600 mb-6">
        {therapistName} bietet folgende Online-Kurse an:
      </p>

      <div className="space-y-4">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="block p-6 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-700 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 line-clamp-2">{course.description}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-teal-700">
                  {formatPrice(course.price, course.currency)}
                </div>
                <div className="text-sm text-gray-500 mt-1">einmalig</div>
              </div>
            </div>
            <div className="mt-4 inline-flex items-center text-teal-600 text-sm font-medium group-hover:text-teal-700">
              Mehr erfahren →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
