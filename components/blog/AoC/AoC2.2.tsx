'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const PATTERN_EASING: number[] = [0.22, 0.61, 0.36, 1]

interface AoC22Props {
  value: string // e.g. "123123" or "123121"
  stepMs?: number // optional, default ~900ms per step
}

interface StepState {
  patternLen: number // length of candidate prefix p
  index: number // current index being checked
  lastResult: 'match' | 'mismatch' | null
}

export default function AoC22({ value, stepMs = 900 }: AoC22Props) {
  const [state, setState] = useState<StepState>({
    patternLen: 1,
    index: 1,
    lastResult: null,
  })

  const len = value.length
  const pattern = value.slice(0, state.patternLen)
  const currentChar = value[state.index] ?? ''

  // Auto-advance through the string, then loop
  useEffect(() => {
    if (len <= 1) return

    const id = window.setTimeout(() => {
      setState((prev) => {
        const { patternLen, index } = prev

        // If we've gone past the string, restart
        if (index >= len) {
          return { patternLen: 1, index: 1, lastResult: null }
        }

        const s = value
        const expected = s[index % patternLen]
        const actual = s[index]

        if (actual === expected) {
          // match: keep pattern, move to next character
          return {
            patternLen,
            index: index + 1,
            lastResult: 'match',
          }
        } else {
          // mismatch: pattern grows to include this character
          return {
            patternLen: index + 1,
            index: index + 1,
            lastResult: 'mismatch',
          }
        }
      })
    }, stepMs)

    return () => window.clearTimeout(id)
  }, [value, len, state.index, state.patternLen, stepMs])

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-950 to-neutral-900 p-6 text-white">
      {/* Input row */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-[11px] tracking-[0.25em] text-white/35 uppercase">
          Input
        </div>
        <motion.div
          key={value}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: PATTERN_EASING }}
          className="font-mono text-2xl"
        >
          {value}
        </motion.div>

        {/* Boxes row with highlights */}
        <div className="mt-2 flex justify-center gap-1">
          {value.split('').map((ch, idx) => {
            const isInPattern = idx < state.patternLen
            const isCurrent = idx === state.index
            let classes =
              'inline-flex items-center justify-center w-8 h-9 rounded-md border text-sm font-mono transition-colors'

            // Base styling
            let bg = 'bg-white/5'
            let border = 'border-white/15'
            let color = 'text-white/85'

            // Pattern candidate area
            if (isInPattern) {
              bg = 'bg-sky-500/15'
              border = 'border-sky-400/70'
              color = 'text-sky-100'
            }

            // Current checked char overrides color
            if (isCurrent) {
              if (state.lastResult === 'match') {
                bg = 'bg-emerald-500/20'
                border = 'border-emerald-400'
                color = 'text-emerald-100'
              } else if (state.lastResult === 'mismatch') {
                bg = 'bg-rose-500/25'
                border = 'border-rose-400'
                color = 'text-rose-100'
              } else {
                bg = 'bg-amber-500/15'
                border = 'border-amber-400/80'
                color = 'text-amber-50'
              }
            }

            return (
              <span key={idx} className={`${classes} ${bg} ${border} ${color}`}>
                {ch}
              </span>
            )
          })}
        </div>

        {/* Explanation text */}
      </div>
    </div>
  )
}
