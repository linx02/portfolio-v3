'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { use } from 'motion/react-m'

const EASING: number[] = [0.22, 0.61, 0.36, 1]

type Phase = 'scan' | 'lock' | 'done'

interface ScanState {
  sp: number // start pointer of window
  bp: number // end pointer (exclusive) of window
  i: number // how many digits have been picked so far
  j: number // current scanning index in [sp, bp)
  m: number // current max index in [sp, j]
  chosen: number[] // picked indices, in order
  phase: Phase
}

interface AoC3Props {
  bank: string
  n: number // how many digits to pick
  label?: string
  scanStepMs?: number // time per j-step
  lockPauseMs?: number // pause after each pick
}

function initState(bank: string, n: number): ScanState {
  const len = bank.length
  if (len === 0 || n <= 0 || n > len) {
    return {
      sp: 0,
      bp: 0,
      i: 0,
      j: 0,
      m: 0,
      chosen: [],
      phase: 'done',
    }
  }

  const sp = 0
  const bp = len - n + 1 // initial window end
  return {
    sp,
    bp,
    i: 0,
    j: sp,
    m: sp,
    chosen: [],
    phase: 'scan',
  }
}

function stepOnce(state: ScanState, bank: string, n: number): ScanState {
  if (state.phase === 'done') return state
  const len = bank.length

  // Safety: if pointers are out of range, stop.
  if (state.sp >= len || state.bp <= state.sp) {
    return { ...state, phase: 'done' }
  }

  if (state.phase === 'scan') {
    const { sp, bp, j, m } = state

    // Compare current j with current max m
    let newM = m
    if (bank[j] > bank[m]) {
      newM = j
    }

    // Move scanning pointer
    if (j + 1 < bp) {
      return {
        ...state,
        j: j + 1,
        m: newM,
      }
    }

    // Reached end of window → next phase will lock the max
    return {
      ...state,
      m: newM,
      phase: 'lock',
    }
  }

  if (state.phase === 'lock') {
    const newChosen = [...state.chosen, state.m]
    const newI = state.i + 1

    // Update window for next pick
    let sp = state.m + 1
    let bp = state.bp + 1

    // If we've picked n digits or run out of room, we’re done
    if (newI >= n || sp >= len) {
      return {
        ...state,
        chosen: newChosen,
        i: newI,
        sp,
        bp,
        phase: 'done',
      }
    }

    // Start new scan from updated window
    if (bp > len) bp = len // clamp just in case

    return {
      sp,
      bp,
      i: newI,
      j: sp,
      m: sp,
      chosen: newChosen,
      phase: 'scan',
    }
  }

  return state
}

export default function AoC3({
  bank,
  n,
  scanStepMs = 150,
  lockPauseMs = 950,
}: AoC3Props) {
  const [state, setState] = useState<ScanState>(() => initState(bank, n))
  const [running, setRunning] = useState(true)

  // Reset when bank or n change
  useEffect(() => {
    setState(initState(bank, n))
  }, [bank, n])

  // Animation loop: move j step-by-step, pause when locking
  useEffect(() => {
    if (!running || state.phase === 'done') return

    const delay = state.phase === 'scan' ? scanStepMs : lockPauseMs

    const id = window.setTimeout(() => {
      setState((prev) => stepOnce(prev, bank, n))
    }, delay)

    return () => window.clearTimeout(id)
  }, [
    running,
    state.phase,
    state.sp,
    state.bp,
    state.j,
    state.m,
    state.i,
    bank,
    n,
    scanStepMs,
    lockPauseMs,
  ])

  const len = bank.length
  const { sp, bp, j, m, chosen, phase, i } = state

  const chosenDigits = chosen.map((idx) => bank[idx]).join('')
  const chosenValue = chosenDigits ? Number(chosenDigits) : 0

  const done = phase === 'done'

  useEffect(() => {
    if (!done) return

    const id = window.setTimeout(() => {
      // restart the scan from the beginning
      setState(initState(bank, n))
      // running already true by default, so the animation loop will pick up
    }, 5000)

    return () => window.clearTimeout(id)
  }, [done, bank, n])

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-950 to-neutral-900 p-8 text-white">
      {/* Digits row */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-[11px] tracking-[0.25em] text-white/35 uppercase">
          N=12
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {bank.split('').map((ch, idx) => {
            const inWindow = idx >= sp && idx < bp && phase !== 'done'
            const isChosen = chosen.includes(idx)
            const isScan = phase === 'scan' && idx === j
            const isCurrentMax =
              (phase === 'scan' || phase === 'lock') && idx === m

            let bg = 'bg-white/5'
            let border = 'border-white/20'
            let text = 'text-white'

            if (inWindow) {
              bg = 'bg-white/10'
            }

            if (isChosen) {
              bg = 'bg-emerald-500/25'
              border = 'border-emerald-400'
              text = 'text-emerald-100'
            }

            if (isCurrentMax && !isChosen) {
              bg = 'bg-sky-500/25'
              border = 'border-sky-400'
              text = 'text-sky-100'
            }

            if (isScan && !isChosen) {
              border = 'border-amber-400'
            }

            return (
              <motion.div
                key={idx}
                layout
                className={`relative inline-flex h-9 w-8 items-center justify-center rounded-md border font-mono text-sm ${bg} ${border} ${text}`}
                transition={{ duration: 0.25, ease: EASING }}
              >
                {ch}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Window bar */}
    </div>
  )
}
