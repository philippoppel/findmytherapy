// Script to update remaining blog posts with new fields
// Run with: npx tsx scripts/update-blog-posts.ts

const remainingPosts = [
  {
    slug: 'therapieformen-vergleich',
    authorId: 'team-findmytherapy',
    tags: ['Therapieformen', 'Verhaltenstherapie', 'Tiefenpsychologie', 'Psychotherapie'],
    featuredImage: {
      src: '/images/blog/therapy-types.jpg',
      alt: 'Verschiedene Psychotherapieformen im Vergleich – Verhaltenstherapie, Tiefenpsychologie, Systemische Therapie',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['kognitive-verhaltenstherapie-erklaert', 'wirksamkeit-psychotherapie-studien'],
  },
  {
    slug: 'kognitive-verhaltenstherapie-erklaert',
    authorId: 'team-findmytherapy',
    tags: ['KVT', 'Verhaltenstherapie', 'Angst', 'Depression', 'Evidenzbasiert'],
    featuredImage: {
      src: '/images/blog/cbt-therapy.jpg',
      alt: 'Kognitive Verhaltenstherapie Sitzung – Therapeut erklärt Denkmuster',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['therapieformen-vergleich', 'mental-health-strategien-alltag'],
  },
  {
    slug: 'mental-health-strategien-alltag',
    authorId: 'team-findmytherapy',
    tags: ['Selbsthilfe', 'Achtsamkeit', 'Stressbewältigung', 'Prävention', 'Alltagsstrategien'],
    featuredImage: {
      src: '/images/blog/daily-strategies.jpg',
      alt: 'Person praktiziert Achtsamkeit und Selbstfürsorge im Alltag',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['burnout-praevention-forschung', 'kognitive-verhaltenstherapie-erklaert'],
  },
  {
    slug: 'burnout-praevention-forschung',
    authorId: 'team-findmytherapy',
    tags: ['Burnout', 'Prävention', 'Forschung', 'Arbeitswelt', 'Stressmanagement'],
    featuredImage: {
      src: '/images/blog/burnout-prevention.jpg',
      alt: 'Burnout-Prävention am Arbeitsplatz – gesunde Work-Life-Balance',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['mental-health-strategien-alltag', 'mental-health-benefits-fuer-teams'],
  },
  {
    slug: 'mental-health-oesterreich-zahlen-fakten',
    authorId: 'team-findmytherapy',
    tags: ['Österreich', 'Statistik', 'Versorgung', 'Psychische Gesundheit', 'Daten'],
    featuredImage: {
      src: '/images/blog/mental-health-austria.jpg',
      alt: 'Mentale Gesundheit in Österreich – Statistiken und Versorgungslage',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['therapeuten-netzwerk-aufbau-transparenz', 'wirksamkeit-psychotherapie-studien'],
  },
  {
    slug: 'wirksamkeit-psychotherapie-studien',
    authorId: 'team-findmytherapy',
    tags: ['Evidenz', 'Forschung', 'Wirksamkeit', 'Studien', 'Wissenschaft'],
    featuredImage: {
      src: '/images/blog/therapy-effectiveness.jpg',
      alt: 'Wissenschaftliche Studien zur Wirksamkeit von Psychotherapie',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['therapieformen-vergleich', 'kognitive-verhaltenstherapie-erklaert'],
  },
  {
    slug: 'psychologe-psychotherapeut-psychiater-unterschiede',
    authorId: 'team-findmytherapy',
    tags: ['Psychologe', 'Psychotherapeut', 'Psychiater', 'Unterschiede', 'Berufsbilder'],
    featuredImage: {
      src: '/images/blog/profession-differences.jpg',
      alt: 'Unterschiede zwischen Psychologe, Psychotherapeut und Psychiater erklärt',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['therapeuten-netzwerk-aufbau-transparenz', 'therapieformen-vergleich'],
  },
  {
    slug: 'screening-instrumente-phq9-gad7-who5',
    authorId: 'team-findmytherapy',
    tags: ['PHQ-9', 'GAD-7', 'WHO-5', 'Screening', 'Assessment', 'Diagnostik'],
    featuredImage: {
      src: '/images/blog/screening-tools.jpg',
      alt: 'Screening-Instrumente PHQ-9, GAD-7 und WHO-5 für mentale Gesundheit',
      width: 1200,
      height: 630,
    },
    relatedPosts: ['digitale-ersteinschaetzung-mental-health', 'wirksamkeit-psychotherapie-studien'],
  },
]

console.log('Blog post updates to apply:')
console.log(JSON.stringify(remainingPosts, null, 2))
console.log('\nThese updates need to be manually applied to lib/blogData.ts')
console.log(`Total posts to update: ${remainingPosts.length}`)
