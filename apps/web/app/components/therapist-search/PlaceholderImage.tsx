'use client'

interface PlaceholderImageProps {
  therapistId: string
  className?: string
}

// 6 abstract, calming illustration patterns for therapist placeholders
const illustrations = [
  // 1. Gentle Waves
  {
    id: 'waves',
    viewBox: '0 0 200 200',
    gradient: ['#E0F2FE', '#BAE6FD', '#7DD3FC'], // soft sky blue
    paths: [
      'M0,100 Q50,80 100,100 T200,100 L200,200 L0,200 Z',
      'M0,130 Q50,110 100,130 T200,130 L200,200 L0,200 Z',
      'M0,160 Q50,140 100,160 T200,160 L200,200 L0,200 Z',
    ],
  },
  // 2. Abstract Leaves
  {
    id: 'leaves',
    viewBox: '0 0 200 200',
    gradient: ['#D1FAE5', '#A7F3D0', '#6EE7B7'], // soft green
    paths: [
      'M100,50 Q120,70 140,100 Q120,130 100,150 Q80,130 60,100 Q80,70 100,50 Z',
      'M60,80 Q75,95 90,120 Q75,145 60,160 Q45,145 30,120 Q45,95 60,80 Z',
      'M140,80 Q155,95 170,120 Q155,145 140,160 Q125,145 110,120 Q125,95 140,80 Z',
    ],
  },
  // 3. Circular Ripples
  {
    id: 'ripples',
    viewBox: '0 0 200 200',
    gradient: ['#FCE7F3', '#FBCFE8', '#F9A8D4'], // soft pink
    paths: [
      'M100,100 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0',
      'M100,100 m-45,0 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0',
      'M100,100 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0',
    ],
  },
  // 4. Geometric Mountains
  {
    id: 'mountains',
    viewBox: '0 0 200 200',
    gradient: ['#E0E7FF', '#C7D2FE', '#A5B4FC'], // soft lavender
    paths: [
      'M0,200 L50,120 L100,140 L150,90 L200,130 L200,200 Z',
      'M0,200 L40,150 L90,170 L140,130 L180,160 L200,200 Z',
      'M20,200 L70,160 L120,180 L170,150 L200,200 Z',
    ],
  },
  // 5. Abstract Petals
  {
    id: 'petals',
    viewBox: '0 0 200 200',
    gradient: ['#FEF3C7', '#FDE68A', '#FCD34D'], // soft yellow
    paths: [
      'M100,100 Q80,60 100,40 Q120,60 100,100 Z',
      'M100,100 Q140,80 160,100 Q140,120 100,100 Z',
      'M100,100 Q120,140 100,160 Q80,140 100,100 Z',
      'M100,100 Q60,120 40,100 Q60,80 100,100 Z',
    ],
  },
  // 6. Flowing Lines
  {
    id: 'flow',
    viewBox: '0 0 200 200',
    gradient: ['#DBEAFE', '#BFDBFE', '#93C5FD'], // soft blue
    paths: [
      'M0,60 Q50,40 100,60 T200,60',
      'M0,100 Q50,80 100,100 T200,100',
      'M0,140 Q50,120 100,140 T200,140',
      'M0,180 Q50,160 100,180 T200,180',
    ],
  },
]

// Hash function to consistently select an illustration based on ID
function getIllustrationIndex(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash) % illustrations.length
}

export function PlaceholderImage({ therapistId, className = '' }: PlaceholderImageProps) {
  const index = getIllustrationIndex(therapistId)
  const illustration = illustrations[index]

  return (
    <div className={`flex h-full w-full items-center justify-center overflow-hidden ${className}`}>
      <svg
        viewBox={illustration.viewBox}
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Therapeut Placeholder"
      >
        <defs>
          <linearGradient id={`gradient-${therapistId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={illustration.gradient[0]} />
            <stop offset="50%" stopColor={illustration.gradient[1]} />
            <stop offset="100%" stopColor={illustration.gradient[2]} />
          </linearGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#gradient-${therapistId})`} />
        {illustration.paths.map((path, idx) => (
          <path
            key={idx}
            d={path}
            fill="white"
            fillOpacity={0.15 + idx * 0.1}
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity={0.3}
          />
        ))}
      </svg>
    </div>
  )
}
