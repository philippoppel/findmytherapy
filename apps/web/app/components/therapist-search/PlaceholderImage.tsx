'use client';

interface PlaceholderImageProps {
  therapistId: string;
  displayName?: string;
  className?: string;
}

// Professional gradient color schemes for therapist avatars
const gradients = [
  {
    id: 'ocean',
    from: '#0EA5E9', // sky-500
    to: '#0284C7', // sky-600
    text: '#FFFFFF',
  },
  {
    id: 'forest',
    from: '#10B981', // emerald-500
    to: '#059669', // emerald-600
    text: '#FFFFFF',
  },
  {
    id: 'sunset',
    from: '#F59E0B', // amber-500
    to: '#D97706', // amber-600
    text: '#FFFFFF',
  },
  {
    id: 'lavender',
    from: '#8B5CF6', // violet-500
    to: '#7C3AED', // violet-600
    text: '#FFFFFF',
  },
  {
    id: 'rose',
    from: '#EC4899', // pink-500
    to: '#DB2777', // pink-600
    text: '#FFFFFF',
  },
  {
    id: 'slate',
    from: '#64748B', // slate-500
    to: '#475569', // slate-600
    text: '#FFFFFF',
  },
  {
    id: 'teal',
    from: '#14B8A6', // teal-500
    to: '#0D9488', // teal-600
    text: '#FFFFFF',
  },
  {
    id: 'indigo',
    from: '#6366F1', // indigo-500
    to: '#4F46E5', // indigo-600
    text: '#FFFFFF',
  },
];

// Hash function to consistently select a gradient based on ID
function getGradientIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) % gradients.length;
}

// Extract initials from display name
function getInitials(name?: string): string {
  if (!name) return 'T';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  // For multiple names, take first letter of first and last name
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

export function PlaceholderImage({
  therapistId,
  displayName,
  className = '',
}: PlaceholderImageProps) {
  const index = getGradientIndex(therapistId);
  const gradient = gradients[index];
  const initials = getInitials(displayName);

  return (
    <div
      className={`flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      }}
    >
      {/* Subtle decorative pattern in background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={`pattern-${therapistId}`}
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="2" fill="white" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pattern-${therapistId})`} />
        </svg>
      </div>

      {/* Large initials */}
      <span
        className="relative z-10 select-none text-6xl font-bold tracking-tight"
        style={{ color: gradient.text }}
        aria-label={`Initials for ${displayName || 'Therapeut'}`}
      >
        {initials}
      </span>
    </div>
  );
}
