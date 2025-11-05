'use client'

import PulsingBall from '@/components/komplettering/PulsingBall'
import Link from 'next/link'

type GalleryItem = {
  title: string
  link: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  { title: 'plexiglasbutiken.se', link: 'https://plexiglasbutiken.se' },
  { title: 'tripack.se', link: 'https://tripack.se' },
  { title: 'nh.se', link: 'https://nh.se' },
  { title: 'delarstore.se', link: 'https://delarstore.se' },
  { title: 'fleetzy.se', link: 'https://fleetzy.se' },
  { title: 'rodem.se', link: 'https://rodem.se' },
  { title: 'bloggbotten.se', link: 'https://bloggbotten.se' },
  { title: 'commercialactors.com', link: 'https://commercialactors.com' },
  { title: 'schultzbergagency.com', link: 'https://schultzbergagency.com' },
  { title: 'schultzberggroup.com', link: 'https://schultzberggroup.com' },
  { title: 'medhouse.se', link: 'https://medhouse.se' },
  { title: 'stockholmpsykoterapi.se', link: 'https://stockholmpsykoterapi.se' },
  { title: 'saelab.se', link: 'https://saelab.se' },
  { title: 'rsmhstockholm.se', link: 'https://rsmhstockholm.se' },
  { title: 'elbesiktningar.se', link: 'https://elbesiktningar.se' },
  {
    title: 'midgardssamfallighetsforening.se',
    link: 'https://midgardssamfallighetsforening.se',
  },
  { title: 'alltitak.se', link: 'https://alltitak.se' },
  { title: 'sofiaror.se', link: 'https://sofiaror.se' },
  { title: 'aceconsultinggroup.se', link: 'https://aceconsultinggroup.se' },
  { title: 'staffscandinavia.se', link: 'https://staffscandinavia.se' },
  { title: 'smartabilval.se', link: 'https://smartabilval.se' },
  { title: 'deepblueexplorers.com', link: 'https://deepblueexplorers.com' },
  { title: 'strang.se', link: 'https://strang.se' },
  { title: 'nsfr.se', link: 'https://nsfr.se' },
  { title: 'winthers.se', link: 'https://winthers.se' },
  { title: 'sehem.se', link: 'https://sehem.se' },
  { title: 'styrelsekonsulten.se', link: 'https://styrelsekonsulten.se' },
]

export default function GalleryRollers() {
  const row1 = GALLERY_ITEMS.filter((_, i) => i % 3 === 0)
  const row2 = GALLERY_ITEMS.filter((_, i) => i % 3 === 1)
  const row3 = GALLERY_ITEMS.filter((_, i) => i % 3 === 2)

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .roller-wrapper {
            overflow: hidden;
            width: 100%;
          }
          .roller-track {
            display: flex;
            gap: 12px;
            white-space: nowrap;
          }
          .roller-track:hover {
            animation-play-state: paused;
          }
          .roller-item {
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 10px 14px;
            min-width: 200px;
            backdrop-filter: blur(6px);
          }
          .scroll-left {
            animation: scroll-left 28s linear infinite;
          }
          .scroll-right {
            animation: scroll-right 28s linear infinite;
          }
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `,
        }}
      />
      <div className="mb-8 flex space-x-2">
        <Link href="/" className="underline">
          Startsida
        </Link>
        <Link href="/komplettering" className="underline">
          Kompletteringssida
        </Link>
      </div>
      <h1 className="text-lg font-medium">Projektgalleri</h1>
      <p className="mb-4 text-sm text-zinc-400">
        En samling av de projekt jag jobbat på
      </p>
      <div className="relative rounded-2xl border-1 border-zinc-700 p-4">
        <div className="absolute top-[-10px] right-[50px]">
          <PulsingBall content="5" />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'radial-gradient(circle at top, #0f172a, #020617 60%)',
            padding: '18px 0',
            borderRadius: 20,
          }}
        >
          <RollerRow items={row1} direction="left" />
          <RollerRow items={row2} direction="right" />
          <RollerRow items={row3} direction="left" />
        </div>
      </div>
    </>
  )
}

function RollerRow({
  items,
  direction,
}: {
  items: GalleryItem[]
  direction: 'left' | 'right'
}) {
  // Dubblera för längre scroll
  const doubled = [...items, ...items]

  return (
    <div className="roller-wrapper">
      <div
        className={`roller-track ${
          direction === 'left' ? 'scroll-left' : 'scroll-right'
        }`}
      >
        {doubled.map((item, i) => (
          <a
            key={item.title + i}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="roller-item"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            <div style={{ fontWeight: 600, fontSize: 13 }}>{item.title}</div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.5,
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.link}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
