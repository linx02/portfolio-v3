'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="mb-8 flex items-center">
      <Image
        src="/profilbild.png"
        alt="Linus Elvius"
        width={75}
        height={75}
        className="mr-4 rounded-full"
      />
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          Linus Elvius
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Utvecklare & Säkerhetsentusiast
        </TextEffect>
      </div>
    </header>
  )
}
