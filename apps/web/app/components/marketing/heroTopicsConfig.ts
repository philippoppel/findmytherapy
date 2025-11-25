export interface HeroTopic {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  targetSection: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    rotate: string;
  };
  animation: {
    yOffset: number;
    xOffset: number;
    duration: number;
    delay: number;
    rotateRange: number;
  };
}

export const heroTopics: HeroTopic[] = [
  // Linke Seite - 4 Karten, klar getrennt
  {
    id: 'depression',
    label: 'Depression',
    imageSrc: '/images/hero-topics/depression.jpg',
    imageAlt: 'Person in nachdenklicher Stimmung - Hilfe bei Depression',
    targetSection: '/blog/depression-verstehen-bewaeltigen',
    position: {
      top: '0%',
      left: '8%',
      rotate: '-3deg',
    },
    animation: {
      yOffset: 8,
      xOffset: 4,
      duration: 7.5,
      delay: 0,
      rotateRange: 1.5,
    },
  },
  {
    id: 'work-stress',
    label: 'Beruf',
    imageSrc: '/images/hero-topics/work-stress.jpg',
    imageAlt: 'Erschöpfte Person am Arbeitsplatz - Hilfe bei beruflichem Stress',
    targetSection: '/blog/burnout-erkennen-vorbeugen',
    position: {
      top: '26%',
      left: '3%',
      rotate: '2deg',
    },
    animation: {
      yOffset: 6,
      xOffset: 5,
      duration: 8.5,
      delay: 0.3,
      rotateRange: 1.2,
    },
  },
  {
    id: 'burnout',
    label: 'Burnout',
    imageSrc: '/images/hero-topics/burnout.jpg',
    imageAlt: 'Erschöpfte Person ruht sich aus - Hilfe bei Burnout',
    targetSection: '/blog/burnout-praevention-forschung',
    position: {
      top: '52%',
      left: '6%',
      rotate: '-2deg',
    },
    animation: {
      yOffset: 7,
      xOffset: 3,
      duration: 9.0,
      delay: 0.6,
      rotateRange: 1.8,
    },
  },
  {
    id: 'trauma',
    label: 'Trauma',
    imageSrc: '/images/hero-topics/trauma.jpg',
    imageAlt: 'Hoffnungsvolle Szene in der Natur - Hilfe bei Trauma',
    targetSection: '/blog/therapieformen-vergleich',
    position: {
      top: '78%',
      left: '10%',
      rotate: '2deg',
    },
    animation: {
      yOffset: 5,
      xOffset: 6,
      duration: 8.0,
      delay: 0.9,
      rotateRange: 1.4,
    },
  },
  // Rechte Seite - 4 Karten, klar getrennt
  {
    id: 'anxiety',
    label: 'Angst',
    imageSrc: '/images/hero-topics/anxiety.jpg',
    imageAlt: 'Besorgte Person - Hilfe bei Angststörungen',
    targetSection: '/blog/angststoerungen-formen-symptome-behandlung',
    position: {
      top: '2%',
      right: '6%',
      rotate: '3deg',
    },
    animation: {
      yOffset: 7,
      xOffset: 4,
      duration: 8.2,
      delay: 0.15,
      rotateRange: 1.6,
    },
  },
  {
    id: 'relationship',
    label: 'Beziehung',
    imageSrc: '/images/hero-topics/relationship.jpg',
    imageAlt: 'Paar hält Hände - Hilfe bei Beziehungsproblemen',
    targetSection: '/blog/richtigen-therapeuten-finden',
    position: {
      top: '28%',
      right: '2%',
      rotate: '-2deg',
    },
    animation: {
      yOffset: 6,
      xOffset: 5,
      duration: 7.8,
      delay: 0.45,
      rotateRange: 1.3,
    },
  },
  {
    id: 'fear-of-flying',
    label: 'Flugangst',
    imageSrc: '/images/hero-topics/fear-of-flying.jpg',
    imageAlt: 'Blick aus Flugzeugfenster - Hilfe bei Flugangst',
    targetSection: '/blog/panikattacken-verstehen-bewaeltigen',
    position: {
      top: '54%',
      right: '5%',
      rotate: '2deg',
    },
    animation: {
      yOffset: 8,
      xOffset: 3,
      duration: 8.8,
      delay: 0.75,
      rotateRange: 1.7,
    },
  },
  {
    id: 'self-esteem',
    label: 'Selbstwert',
    imageSrc: '/images/hero-topics/self-esteem.jpg',
    imageAlt: 'Person blickt in Spiegel - Hilfe bei Selbstwertproblemen',
    targetSection: '/blog/mental-health-strategien-alltag',
    position: {
      top: '80%',
      right: '8%',
      rotate: '-2deg',
    },
    animation: {
      yOffset: 5,
      xOffset: 6,
      duration: 9.2,
      delay: 1.05,
      rotateRange: 1.4,
    },
  },
];
