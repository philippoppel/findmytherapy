import { GraduationCap, Award, BookOpen, CheckCircle2, BadgeCheck } from 'lucide-react';

interface MicrositeQualificationsProps {
  qualifications: string[];
}

// Determine icon based on qualification type
function getQualificationIcon(qualification: string) {
  const q = qualification.toLowerCase();
  if (q.includes('dr.') || q.includes('master') || q.includes('magister')) {
    return GraduationCap;
  }
  if (q.includes('zertifiziert') || q.includes('weiterbildung')) {
    return Award;
  }
  if (q.includes('ausbildung')) {
    return BookOpen;
  }
  if (q.includes('mitglied')) {
    return BadgeCheck;
  }
  return CheckCircle2;
}

// Determine color based on qualification type
function getQualificationColor(qualification: string) {
  const q = qualification.toLowerCase();
  if (q.includes('dr.') || q.includes('master') || q.includes('magister')) {
    return 'bg-purple-100 text-purple-700 border-purple-200';
  }
  if (q.includes('zertifiziert')) {
    return 'bg-green-100 text-green-700 border-green-200';
  }
  if (q.includes('ausbildung')) {
    return 'bg-blue-100 text-blue-700 border-blue-200';
  }
  if (q.includes('mitglied')) {
    return 'bg-amber-100 text-amber-700 border-amber-200';
  }
  if (q.includes('weiterbildung')) {
    return 'bg-teal-100 text-teal-700 border-teal-200';
  }
  return 'bg-primary-100 text-primary-700 border-primary-200';
}

export function MicrositeQualifications({ qualifications }: MicrositeQualificationsProps) {
  if (!qualifications || qualifications.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Qualifikationen & Zertifikate</h2>

      <div className="flex flex-wrap gap-3">
        {qualifications.map((qualification, index) => {
          const Icon = getQualificationIcon(qualification);
          const colorClass = getQualificationColor(qualification);

          return (
            <div
              key={index}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border ${colorClass} transition-transform hover:scale-105`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">{qualification}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
