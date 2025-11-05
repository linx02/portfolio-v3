type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type Certification = {
  name: string
  description: string
  link: string
  image: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  id: string
}

type Studies = {
  school: string
  title: string
  start: string
  end: string
  id: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

type Client = {
  logo: string
  name: string
  link: string
}

type Review = {
  name: string
  role: string
  content: string
  company: string
  backlink: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Fleetzy',
    description:
      'Transportbokningsplattform för limousine-, buss- och flyttjänster.',
    link: 'https://fleetzy.se/',
    video: '/fleetzy.mp4',
    id: 'project1',
  },
  {
    name: 'MössaUp',
    description: 'E-handelsplattform för studentmössor.',
    link: 'https://mossaup.se/',
    video: '/mossaup.mp4',
    id: 'project2',
  },
  {
    name: 'Rodem Reklam',
    description: 'Reklamartikelföretag, integrerat med leverantörens system.',
    link: 'https://rodem.se/',
    video: '/rodem.mp4',
    id: 'project2',
  },
  {
    name: 'Smartabilval',
    description: 'Värderingsplattform för bilar.',
    link: 'https://smartabilval.se/',
    video: '/smartabilval.mp4',
    id: 'project2',
  },
]

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Certified Penetration Testing Specialist',
    description: '(HTB CPTS), Ej klar, uppdateras inom kort...',
    link: 'https://academy.hackthebox.com/achievement/badge/af20025e-8e3b-11f0-9254-bea50ffe6cb4',
    image: '/cpts.jpg',
    id: 'cert1',
  },
  {
    name: 'Diploma in Full Stack Development',
    description: 'Code Institute, inriktning Predictive Analytics',
    link: 'https://www.credential.net/e68b4087-87ee-4c84-9c9e-ee546a191bbb#acc.KMJbZ12x',
    image: '/certificate.png',
    id: 'cert2',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Frilans',
    title: 'Full Stack Utvecklare',
    start: '2024',
    end: 'Nu',
    id: 'work1',
  },
  {
    company: 'Tech Agent',
    title: 'Full Stack Utvecklare',
    start: '2024',
    end: '2024',
    id: 'work2',
  },
  {
    company: 'Luday',
    title: 'Full Stack Praktikant',
    start: '2023',
    end: '2024',
    id: 'work3',
  },
]

export const STUDIES: Studies[] = [
  {
    school: 'Jensen YH',
    title: 'Cloudutvecklare AWS',
    start: '2024',
    end: 'Nu',
    id: 'study1',
  },
  {
    school: 'Code Institute',
    title: 'Diploma in Full Stack Development - Predictive Analytics',
    start: '2023',
    end: '2023',
    id: 'study2',
  },
  {
    school: 'Thorén Business School',
    title: 'Handels- och administrationsprogrammet',
    start: '2019',
    end: '2022',
    id: 'study3',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Exploring the Intersection of Design, AI, and Design Engineering',
    description: 'How AI is changing the way we design',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-1',
  },
  {
    title: 'Why I left my job to start my own company',
    description:
      'A deep dive into my decision to leave my job and start my own company',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-2',
  },
  {
    title: 'What I learned from my first year of freelancing',
    description:
      'A look back at my first year of freelancing and what I learned',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-3',
  },
  {
    title: 'How to Export Metadata from MDX for Next.js SEO',
    description:
      'A guide on exporting metadata from MDX files to leverage Next.js SEO features.',
    link: '/blog/example-mdx-metadata',
    uid: 'blog-4',
  },
]

export const CLIENTS: Client[] = [
  {
    name: 'RSMH',
    logo: '/rsmh.svg',
    link: 'https://rsmh.se',
  },
  {
    name: 'Medhouse',
    logo: '/medhouse.png',
    link: 'https://medhouse.se',
  },
  {
    name: 'NSFR',
    logo: '/nsfr.png',
    link: 'https://nsfr.se',
  },
  {
    name: 'Commercial Actors',
    logo: '/commercialactors.webp',
    link: 'https://commercialactors.com',
  },
]

export const REVIEWS: Review[] = [
  {
    name: 'Alexander Badreddine',
    role: 'Ägare',
    company: 'Qonsulta',
    content:
      'Jag har haft nöjet att arbeta med Linus och kan varmt rekommendera honom som utvecklare. Han är lyhörd, effektiv och har en imponerande förmåga att förstå kundens behov och omvandla dem till välfungerande lösningar. Linus levererar alltid med hög kvalitet och stor noggrannhet, samtidigt som han bidrar med en positiv och professionell attityd i teamet. En pålitlig och kompetent utvecklare som gör skillnad i varje projekt.',
    backlink: 'https://qonsulta.se',
  },
  {
    name: 'Patrik Lindberg',
    role: 'VD',
    company: 'Guidelight Solutions',
    content:
      'Har löpande köpt tjänster av Linus och han är enormt kunnig med djup kunskap inom flera områden vilket jag uppskattar mycket då mina uppdrag omfattar en stor mängd olika förutsättningar. Alltid bra och personlig kommunikation och korta leveranstider. Rekommenderar honom varmt!',
    backlink: 'https://guidelight.se',
  },
  {
    name: 'Sara Causey',
    role: 'Ägare & Författare',
    company: 'Causey Consulting',
    content:
      'I highly recommend Linus. He\'s a diligent, hard worker and he has good instincts to "think outside the box" when needed. I appreciate his dedication and persistence.',
    backlink: 'https://causeyconsultingllc.com/',
  },
  {
    name: 'Peter Borneskog',
    role: 'VD',
    company: 'Allt i Tak Entreprenad',
    content: 'Linus löser alla mina problem på ett snabbt och smidigt sätt.',
    backlink: 'https://alltitak.se',
  },
  {
    name: 'Jonas Fahlén',
    role: 'Delägare',
    company: 'Rodemreklam',
    content:
      'Har jobbat med Guidelight i många år och aldrig blivit besviken. Ett mindre bolag (som vi själva är) med ett enormt engagemang och man känner sig sedd som kund. Duktiga på att se från vårt perspektiv och alltid öppna och flexibla. Snabbheten har också alltid varit viktig för oss och där gör de oss heller inte besvikna. Linus är den vi har återkommande kontakt med och vi är otroligt nöjda med det lyft vi tillsammans har lyckats med på vår hemsida. Stort tack och fortsättning följer.',
    backlink: 'https://rodem.se',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/linx02',
  },
  {
    label: 'LinkedIn',
    link: 'https://linkedin.com/in/linus-elvius-52b098266',
  },
]

export const EMAIL = 'elvius.linus@gmail.com'
