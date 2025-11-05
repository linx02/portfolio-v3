'use client'

import ImpossibleButton from '@/components/komplettering/ImpossibleButton'
import { Accordion } from '@/components/komplettering/Accordion'
import PulsingBall from '@/components/komplettering/PulsingBall'
import { Lightbulb, CircleAlert } from 'lucide-react'
import '../../public/komplettering_/media-queries.css'
import './Loader.css'
import CodeRunner from '@/components/komplettering/CodeRunner'
import { useState } from 'react'
import Link from 'next/link'
import Modal from '@/components/komplettering/Modal'

export default function KompletteringPage() {
  // Körs inte egentligen, syns endast i rutan
  const code = `
const response = await fetch('https://linuselvius.com/komplettering_/media-queries.css')
const css = await response.text()
console.log(css)
    `

  const [css, setCss] = useState<string | null>(null)
  const [cssLoading, setCssLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalTitle, setModalTitle] = useState('')

  const handleRun = async () => {
    // Faktisk körning
    setCssLoading(true)
    const response = await fetch(
      'https://linuselvius.com/komplettering_/media-queries.css',
    )
    const css = await response.text()
    setCss(css)
    setCssLoading(false)
  }

  const openModal = (title: string, content: string) => {
    setModalTitle(title)
    setModalContent(content)
    setModalOpen(true)
  }

  const checklist = [
    {
      title: 'Struktur',
      items: [
        {
          text: 'Minst 3 sidor',
        },
        {
          html: 'En <a href="/" class="underline">startsida</a> med presentation (om dig, företaget, idén eller projektet).',
        },
        {
          html: 'En <a href="/komplettering/galleri" class="underline">gallerisida</a> eller projektsida som visar minst fem olika inlägg, projekt eller exempel.',
        },
        {
          html: '<a href="#checkpoint" class="underline">En sida</a> där användaren kan fylla och spara information (lagring i localStorage).',
        },
      ],
    },
    {
      title: 'Funktionalitet',
      items: [
        {
          injectAfter: (
            <div className="relative mb-4">
              <div className="h-6 w-3 border-b-1 border-l-1 border-zinc-500"></div>
              <div className="absolute top-[14px] left-4 w-5">
                <PulsingBall content="" />
              </div>
            </div>
          ),
          text: 'Minst fem interaktiva funktioner (t.ex. klick, filter, formulärinmatning, dynamiskt innehåll, feedback), implementerade med hjälp av JavaScript.',
        },
        {
          injectAfter: (
            <div className="relative mb-6">
              <div className="h-6 w-3 border-b-1 border-l-1 border-zinc-500"></div>
              <div className="absolute top-[5px] left-4 w-5">
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      openModal('Du klickade på knappen!', 'Bara så du vet.')
                    }
                    className="cursor-pointer rounded-xl border-1 border-zinc-700 p-2 text-nowrap transition-transform duration-300 hover:scale-95"
                  >
                    Klicka mig
                  </button>
                </div>
              </div>
            </div>
          ),
          text: 'Tydlig visuell återkoppling vid användarens handlingar. Exempel: en bekräftelse när användaren sparar information eller skickar ett formulär.',
        },
        {
          injectAfter: (
            <div className="relative mb-4">
              <div className="h-6 w-3 border-b-1 border-l-1 border-zinc-500"></div>
              <div className="absolute top-[11px] left-4 w-5">
                <div className="flex space-x-2">
                  <Link href="/" className="underline">
                    Startsida
                  </Link>
                  <Link href="/komplettering/galleri" className="underline">
                    Gallerisida
                  </Link>
                </div>
              </div>
            </div>
          ),
          text: 'Navigeringen mellan olika sidor på webbplatsen ska vara konsekvent och intuitiv.',
        },
      ],
    },
    {
      title: 'Kod och arkitektur',
      items: [
        {
          text: 'Webbplatsen ska byggas med React och Next.js.',
        },
        {
          text: 'Visa förståelse för komponentbaserad utveckling och dataflöden via props och state.',
        },
        {
          text: 'Koden ska vara läsbar, strukturerad och kommenterad där det behövs.',
        },
      ],
    },
    {
      title: 'Design och layout',
      items: [
        {
          html: 'Webbplatsen ska vara mobilanpassad med <a href="#media-queries" class="underline">@media-queries</a>.',
        },
        {
          text: 'Layout och färgval ska stödja innehållet och användarupplevelsen.',
        },
      ],
    },
  ]

  return (
    <>
      {/* Exponera i sidans källkod som ledtråd */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.secretSwitch = false;
            function deriveId(parts) {
                const str = parts.join("|");
                let hash = 5381;
                for (let i = 0; i < str.length; i++) {
                    hash = (hash * 33) ^ str.charCodeAt(i);
                }
                return (hash >>> 0).toString(16);
            }
            (function() {
              function checkChallenge() {
                try {
                  const val = localStorage.getItem('challenge');
                  if (val === 'pwned') {
                    console.log(deriveId([window.secretSwitch, document.getElementById('buttonCheck').textContent]));
                    if (deriveId([window.secretSwitch, document.getElementById('buttonCheck').textContent]) === 'b9eaa08b') {
                        alert('Där satt den, snyggt!');
                        localStorage.removeItem('challenge');
                    } else {
                        alert('Bra försök, men enklast är att använda knappen ;)');
                        localStorage.removeItem('challenge');
                    }
                  }
                } catch (e) {
                  console.warn('localStorage not available', e);
                }
              }
              checkChallenge();
              setInterval(checkChallenge, 500);
            })();
          `,
        }}
      />

      <main>
        <h1 className="mb-4 font-medium">En interaktiv bedömningsprocess</h1>
        <div className="relative mb-12 rounded-3xl border-1 border-zinc-700 p-4">
          <div className="absolute top-[-10px] right-[50px]">
            <PulsingBall content="1" />
          </div>
          {checklist.map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
              <ul>
                {section.items.map((item, index) => (
                  <div key={index} className="mb-2 flex items-baseline pl-4">
                    <input type="checkbox" />
                    {'html' in item ? (
                      <li
                        className="pl-2"
                        dangerouslySetInnerHTML={{ __html: item.html ?? '' }}
                      ></li>
                    ) : (
                      <li className="pl-2">
                        {item.text}
                        {'injectAfter' in item && item.injectAfter}
                      </li>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex">
          <p id="checkpoint" className="items-center pr-2">
            Sätt nyckeln "challenge" i localStorage till "pwned" för att klara
            utmaningen
          </p>
          <PulsingBall content="2" />
        </div>
        <div className="flex items-center justify-center">
          <ImpossibleButton />
        </div>
        <div className="relative space-y-2 rounded-2xl border-1 border-zinc-700 p-8">
          <div className="absolute top-[-10px] right-[50px]">
            <PulsingBall content="3" />
          </div>
          <Accordion
            icon={<Lightbulb />}
            title="Tips"
            content="Notera att du nu inte kan tabba till knappen, och kolla sidans källkod från rad 26"
          />
          <Accordion
            icon={<CircleAlert />}
            title="Lösning"
            content="Sätt 'window.secretSwitch = true' i konsolen, sätt nyckeln till 'challenge' och värdet till 'pwned', tabba sedan till knappen och tryck enter."
          />
        </div>
        <div id="media-queries">
          <CodeRunner code={code} onRun={handleRun} />
          <pre
            className={`mt-4 rounded-2xl border-1 border-zinc-700 p-4 text-xs ${cssLoading || css ? '' : 'hidden'}`}
          >
            {cssLoading ? (
              <div className="flex w-full justify-center">
                <div className="loader" />
              </div>
            ) : (
              <code>{css}</code>
            )}
          </pre>
        </div>
      </main>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        content={modalContent}
      />
    </>
  )
}
