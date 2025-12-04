'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const EASING: number[] = [0.22, 0.61, 0.36, 1]

interface AoC21Props {
  value: string // e.g. "123123" or "123121"
}

export default function AoC21({ value }: AoC21Props) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0)

  const len = value.length
  const half = Math.floor(len / 2)
  const left = value.slice(0, half)
  const right = value.slice(half)
  const isEven = len % 2 === 0
  const halvesMatch = isEven && left === right

  // Simple loop: show → split → highlight → restart (1s after phase 2)
  useEffect(() => {
    let cancelled = false
    const timeouts: number[] = []

    const runLoop = () => {
      if (cancelled) return

      setPhase(0)
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase(1)
        }, 800),
      )
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase(2)
        }, 1600),
      )
      // restart 1s after phase 2 appears → 1600 + 1000 = 2600
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return
          runLoop()
        }, 2600),
      )
    }

    runLoop()

    return () => {
      cancelled = true
      timeouts.forEach((id) => window.clearTimeout(id))
    }
  }, [value])

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6 text-white">
      <div className="p-2 text-center text-[11px] tracking-[0.25em] text-white/35 uppercase">
        Input
      </div>

      <div className="flex flex-col items-center gap-3">
        <motion.div
          key={value}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: EASING }}
          className="font-mono text-3xl"
        >
          {value}
        </motion.div>

        {/* Split halves */}
        <div className="mt-2 flex items-center gap-2">
          <motion.div
            className="min-w-[4rem] rounded-xl border px-3 py-2 text-center font-mono text-lg"
            animate={
              phase === 2 && halvesMatch
                ? {
                    backgroundColor: 'rgba(16,185,129,0.2)',
                    borderColor: 'rgba(52,211,153,0.9)',
                  }
                : {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(148,163,184,0.6)',
                  }
            }
            transition={{ duration: 0.25, ease: EASING }}
          >
            {left}
          </motion.div>

          <div className="text-sm text-white/40">vs</div>

          <motion.div
            className="min-w-[4rem] rounded-xl border px-3 py-2 text-center font-mono text-lg"
            animate={
              phase === 2
                ? halvesMatch
                  ? {
                      backgroundColor: 'rgba(16,185,129,0.2)',
                      borderColor: 'rgba(52,211,153,0.9)',
                    }
                  : {
                      backgroundColor: 'rgba(239,68,68,0.18)',
                      borderColor: 'rgba(248,113,113,0.9)',
                    }
                : {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(148,163,184,0.6)',
                  }
            }
            transition={{ duration: 0.25, ease: EASING }}
          >
            {right}
          </motion.div>
        </div>

        {/* Caption */}
      </div>
    </div>
  )
}
