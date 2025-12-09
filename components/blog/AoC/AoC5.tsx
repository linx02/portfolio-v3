'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const EASING: number[] = [0.22, 0.61, 0.36, 1]

const RAW_RANGES = ['3-5', '10-14', '16-20', '12-18']
const RAW_IDS = ['1', '5', '8', '11', '17', '32']

type CellChar = number

interface Range {
  id: number
  l: number
  h: number
}

interface Solve1Step {
  idIndex: number
  idValue: number
  rangeIndex: number
  range: Range
  isInRange: boolean
  isLastCheckForId: boolean
}

interface Solve2Step {
  sortedIndex: number
  range: Range
  lAfter: number
  h: number
  skipped: boolean
}

const STEP_MS = 140
const RESTART_DELAY_MS = 3000

const parseRanges = (): Range[] =>
  RAW_RANGES.map((r, idx) => {
    const [lStr, hStr] = r.split('-')
    return {
      id: idx,
      l: parseInt(lStr, 10),
      h: parseInt(hStr, 10),
    }
  })

const parseIds = (): number[] => RAW_IDS.map((v) => parseInt(v, 10))

// ----- Part 1 simulation (solve1) -----
function simulateSolve1(): {
  steps: Solve1Step[]
  ids: number[]
  ranges: Range[]
  idCovered: boolean[]
} {
  const ranges = parseRanges()
  const ids = parseIds()

  const steps: Solve1Step[] = []
  const idCovered: boolean[] = ids.map(() => false)

  ids.forEach((idVal, idIndex) => {
    for (const r of ranges) {
      if (idVal >= r.l && idVal <= r.h) {
        idCovered[idIndex] = true
        break
      }
    }
  })

  ids.forEach((idVal, idIndex) => {
    for (let rIndex = 0; rIndex < ranges.length; rIndex++) {
      const r = ranges[rIndex]
      const inRange = idVal >= r.l && idVal <= r.h
      const isLastCheckForId = inRange || rIndex === ranges.length - 1

      steps.push({
        idIndex,
        idValue: idVal,
        rangeIndex: rIndex,
        range: r,
        isInRange: inRange,
        isLastCheckForId,
      })

      if (inRange) break
    }
  })

  return { steps, ids, ranges, idCovered }
}

// ----- Part 2 simulation (solve2) -----
function simulateSolve2(): {
  steps: Solve2Step[]
  sortedRanges: Range[]
} {
  const ranges = parseRanges()
  const sortedRanges = [...ranges].sort((a, b) => a.l - b.l)

  const steps: Solve2Step[] = []
  let m = 0

  for (let k = 0; k < sortedRanges.length; k++) {
    const r = sortedRanges[k]
    let l = r.l
    const h = r.h

    if (m > l) {
      l = m
    }

    if (m > h) {
      steps.push({
        sortedIndex: k,
        range: r,
        lAfter: l,
        h,
        skipped: true,
      })
      continue
    }

    if (m === l) {
      // a -= 1 in original; here we only visualize coverage
    }

    m = h

    steps.push({
      sortedIndex: k,
      range: r,
      lAfter: l,
      h,
      skipped: false,
    })
  }

  return { steps, sortedRanges }
}

// ----- Combined visualizer -----
export default function AoC5() {
  const {
    steps: solve1Steps,
    ids,
    ranges,
    idCovered,
  } = useMemo(simulateSolve1, [])
  const { steps: solve2Steps } = useMemo(simulateSolve2, [])

  const allNumbers = [...ids, ...ranges.flatMap((r) => [r.l, r.h])]
  const domainMin = Math.min(...allNumbers)
  const domainMax = Math.max(...allNumbers)
  const columns = domainMax - domainMin + 1

  const totalFrames = solve1Steps.length + solve2Steps.length

  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (totalFrames === 0) return

    if (frame < totalFrames - 1) {
      const id = window.setTimeout(() => {
        setFrame((f) => Math.min(f + 1, totalFrames - 1))
      }, STEP_MS)
      return () => window.clearTimeout(id)
    } else {
      const id = window.setTimeout(() => {
        setFrame(0)
      }, RESTART_DELAY_MS)
      return () => window.clearTimeout(id)
    }
  }, [frame, totalFrames])

  const inSolve1 = frame < solve1Steps.length
  const solve1Index = inSolve1 ? frame : solve1Steps.length - 1
  const solve2Index = inSolve1 ? -1 : frame - solve1Steps.length

  const currentSolve1 = solve1Steps[solve1Index]
  const currentSolve2 = solve2Index >= 0 ? solve2Steps[solve2Index] : null

  const coveredBySolve2 = useMemo(() => {
    const covered = new Set<number>()
    if (solve2Index < 0) return covered

    for (let idx = 0; idx <= solve2Index; idx++) {
      const s = solve2Steps[idx]
      if (s.skipped) continue
      for (let x = s.lAfter; x <= s.h; x++) {
        covered.add(x)
      }
    }

    return covered
  }, [solve2Index, solve2Steps])

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-gradient-to-b from-black to-neutral-900 p-6">
      <div className="flex flex-col gap-3">
        {/* Row 1: IDs */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-right font-mono text-[10px] text-white/50 uppercase">
            IDs
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1.5rem))`,
            }}
          >
            {Array.from({ length: columns }).map((_, idx) => {
              const x = domainMin + idx
              const idIndex = ids.findIndex((v) => v === x)
              const hasId = idIndex !== -1

              let bg = 'bg-transparent'
              let border = 'border-transparent'
              let text = ''
              let textColor = 'text-xs text-white'
              let scale = 0

              if (hasId) {
                const isCurrentId =
                  inSolve1 && currentSolve1.idIndex === idIndex
                const isCovered = idCovered[idIndex]

                scale = 1
                text = String(x)

                if (isCurrentId) {
                  bg = 'bg-sky-500'
                  border = 'border-sky-300'
                } else if (frame >= solve1Steps.length) {
                  if (isCovered) {
                    bg = 'bg-emerald-500'
                    border = 'border-emerald-300'
                  } else {
                    bg = 'bg-rose-500'
                    border = 'border-rose-300'
                  }
                } else {
                  bg = 'bg-slate-500'
                  border = 'border-slate-300'
                }
              }

              return (
                <motion.div
                  key={`id-${x}`}
                  className={`flex items-center justify-center rounded-full border ${bg} ${border}`}
                  style={{ width: '1.5rem', height: '1.5rem' }}
                  initial={false}
                  animate={{ scale }}
                  transition={{ duration: 0.2, ease: EASING }}
                >
                  {hasId && (
                    <span className={`font-mono ${textColor}`}>{text}</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Row 2: original ranges */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-right font-mono text-[10px] text-white/50 uppercase">
            Ranges
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1.5rem))`,
            }}
          >
            {Array.from({ length: columns }).map((_, idx) => {
              const x = domainMin + idx
              const inOrigRange = ranges.some((r) => x >= r.l && x <= r.h)

              let bg = 'bg-neutral-900'
              if (inOrigRange) bg = 'bg-slate-700'

              return (
                <motion.div
                  key={`orig-${x}`}
                  className={`h-4 rounded-sm ${bg}`}
                  layout
                  transition={{ duration: 0.2, ease: EASING }}
                />
              )
            })}
          </div>
        </div>

        {/* Row 3: solve2 coverage */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-right font-mono text-[10px] text-white/50 uppercase">
            Coverage
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1.5rem))`,
            }}
          >
            {Array.from({ length: columns }).map((_, idx) => {
              const x = domainMin + idx

              const covered = coveredBySolve2.has(x)
              const inCurrentInterval =
                currentSolve2 &&
                !currentSolve2.skipped &&
                x >= currentSolve2.lAfter &&
                x <= currentSolve2.h

              let bg = 'bg-neutral-900'
              if (covered) bg = 'bg-emerald-500'
              if (inCurrentInterval) bg = 'bg-sky-500'

              return (
                <motion.div
                  key={`cov-${x}`}
                  className={`h-4 rounded-sm ${bg}`}
                  layout
                  transition={{ duration: 0.2, ease: EASING }}
                />
              )
            })}
          </div>
        </div>

        {/* Row 4: X axis */}
        <div className="flex items-center gap-3">
          <div className="w-16 text-right font-mono text-[10px] text-white/50 uppercase">
            X
          </div>
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1.5rem))`,
            }}
          >
            {Array.from({ length: columns }).map((_, idx) => {
              const x = domainMin + idx
              return (
                <div
                  key={`axis-${x}`}
                  className="flex h-4 items-center justify-center font-mono text-[10px] text-white/40"
                >
                  {x}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
