'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type CellChar = '.' | '@' | 'x'

interface StepEvent {
  scanIndex: number
  row: number
  col: number
  charBefore: CellChar // from the snapshot for this scan
  neighbors: {
    row: number
    col: number
    char: CellChar
  }[]
  adjacentAtCount: number
  accessible: boolean // true only if this '@' will become x after scan (on last neighbor check)
  gridSnapshot: CellChar[][] // snapshot at start of this scan (no per-cell changes)
  activeNeighborRow: number
  activeNeighborCol: number
}

interface SimulationResult {
  steps: StepEvent[]
  width: number
  height: number
  scanCount: number
  totalMarked: number
}

// Your given input
const DEFAULT_INPUT = [
  '..@@.@@@@.',
  '@@@.@.@.@@',
  '@@@@@.@.@@',
  '@.@@@@..@.',
  '@@.@@@@.@@',
  '.@@@@@@@.@',
  '.@.@.@.@@@',
  '@.@@@.@@@@',
  '.@@@@@@@@.',
  '@.@.@@@.@.',
]

const NEIGHBOR_OFFSETS: Array<[number, number]> = [
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
]

function cloneGrid(grid: CellChar[][]): CellChar[][] {
  return grid.map((row) => [...row])
}

function simulateAccessibility(lines: string[]): SimulationResult {
  const height = lines.length
  const width = lines[0]?.length ?? 0

  let grid: CellChar[][] = lines.map((row) =>
    row.split('').map((ch) => ch as CellChar),
  )

  const steps: StepEvent[] = []
  let scanIndex = 0
  let totalMarked = 0

  while (true) {
    const snapshot = cloneGrid(grid)
    const toMark: { row: number; col: number }[] = []

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const charBefore = snapshot[i][j]

        // NEW: skip neighbor checking completely if current cell is '.'
        if (charBefore === '.' || charBefore === 'x') {
          steps.push({
            scanIndex,
            row: i,
            col: j,
            charBefore,
            neighbors: [],
            adjacentAtCount: 0,
            accessible: false,
            gridSnapshot: snapshot,
            activeNeighborRow: -1,
            activeNeighborCol: -1,
          })
          continue
        }

        // Collect all in-bounds neighbors first (like the algo loop)
        const neighbors: StepEvent['neighbors'] = []
        let atCount = 0
        for (const [dy, dx] of NEIGHBOR_OFFSETS) {
          const ni = i + dy
          const nj = j + dx
          if (ni < 0 || nj < 0 || ni >= height || nj >= width) continue
          const nChar = snapshot[ni][nj]
          neighbors.push({ row: ni, col: nj, char: nChar })
          if (nChar === '@') atCount++
        }

        const cellAccessible = charBefore === '@' && atCount < 4
        if (cellAccessible) {
          toMark.push({ row: i, col: j })
        }

        // Create one step per neighbor check, with a single "active" neighbor
        neighbors.forEach((n, idx) => {
          const isLastNeighbor = idx === neighbors.length - 1
          steps.push({
            scanIndex,
            row: i,
            col: j,
            charBefore,
            neighbors,
            adjacentAtCount: atCount,
            accessible: cellAccessible && isLastNeighbor, // only true on last neighbor check
            gridSnapshot: snapshot,
            activeNeighborRow: n.row,
            activeNeighborCol: n.col,
          })
        })
      }
    }

    if (toMark.length === 0) {
      break
    }

    for (const { row, col } of toMark) {
      if (grid[row][col] === '@') {
        grid[row][col] = 'x'
        totalMarked++
      }
    }

    scanIndex++
  }

  const scanCount = scanIndex + 1
  return { steps, width, height, scanCount, totalMarked }
}

const STEP_MS = 75
const EASING: number[] = [0.22, 0.61, 0.36, 1]

export default function AoC4() {
  const inputKey = DEFAULT_INPUT.join('\n')

  const { steps, width, height, scanCount, totalMarked } = useMemo(
    () => simulateAccessibility(DEFAULT_INPUT),
    [inputKey],
  )

  const [stepIndex, setStepIndex] = useState(0)
  const [running, setRunning] = useState(true)

  const hasSteps = steps.length > 0
  const currentStep = hasSteps ? steps[stepIndex] : null
  const isComplete = !hasSteps || stepIndex === steps.length - 1

  // Precompute: for each (scan,row,col), at what step index did it first become accessible?
  const firstAccessibleStepByCell = useMemo(() => {
    const map = new Map<string, number>()
    steps.forEach((s, idx) => {
      if (!s.accessible) return
      const key = `${s.scanIndex}-${s.row}-${s.col}`
      if (!map.has(key)) {
        map.set(key, idx)
      }
    })
    return map
  }, [steps])

  // Auto-advance
  useEffect(() => {
    if (!running || !hasSteps || isComplete) return

    const id = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
    }, STEP_MS)

    return () => window.clearTimeout(id)
  }, [running, hasSteps, isComplete, stepIndex, steps.length])

  const handleReset = () => {
    setStepIndex(0)
    setRunning(true)
  }

  // Counts for explaining progress
  const markedSoFar = useMemo(() => {
    const seen = new Set<string>()
    for (let k = 0; k <= stepIndex; k++) {
      const s = steps[k]
      if (s.accessible) {
        seen.add(`${s.row},${s.col}`)
      }
    }
    return seen.size
  }, [steps, stepIndex])

  const currentScanMarkedSoFar = useMemo(() => {
    if (!currentStep) return 0
    const seen = new Set<string>()
    for (let k = 0; k <= stepIndex; k++) {
      const s = steps[k]
      if (s.scanIndex === currentStep.scanIndex && s.accessible) {
        seen.add(`${s.row},${s.col}`)
      }
    }
    return seen.size
  }, [steps, stepIndex, currentStep])

  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-b from-black to-neutral-900 p-6 text-white md:p-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Grid */}
        <div className="flex flex-1 flex-col items-center gap-4">
          <div className="relative">
            {currentStep && (
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${width}, minmax(0, 1.8rem))`,
                }}
              >
                {currentStep.gridSnapshot.map((row, i) =>
                  row.map((cell, j) => {
                    const isCurrent =
                      i === currentStep.row && j === currentStep.col

                    // Use snapshot char always (no mid-scan changes)
                    const logicalChar: CellChar = cell

                    const neighborInfo = currentStep.neighbors.find(
                      (n) => n.row === i && n.col === j,
                    )
                    const isNeighbor = Boolean(neighborInfo)
                    const isNeighborAt = neighborInfo?.char === '@'

                    const isActiveNeighbor =
                      currentStep.activeNeighborRow === i &&
                      currentStep.activeNeighborCol === j

                    // Should this cell show the green "queued" halo in THIS step?
                    const key = `${currentStep.scanIndex}-${i}-${j}`
                    const firstAccessibleStep =
                      firstAccessibleStepByCell.get(key)
                    const showQueuedHalo =
                      typeof firstAccessibleStep === 'number' &&
                      stepIndex > firstAccessibleStep &&
                      logicalChar === '@'

                    const isAt = logicalChar === '@'
                    const isX = logicalChar === 'x'
                    const isDot = logicalChar === '.'

                    let bg = 'bg-neutral-900'
                    let border =
                      'border border-neutral-700/70 group-hover:border-neutral-400/70'
                    let text = 'text-white/70'
                    let ring = ''

                    if (isDot) {
                      bg = 'bg-neutral-950'
                      text = 'text-white/20'
                    }
                    if (isAt) {
                      bg = 'bg-amber-500/25'
                      border = 'border-amber-400/80'
                      text = 'text-amber-100'
                    }
                    if (isX) {
                      bg = 'bg-emerald-500/25'
                      border = 'border-emerald-400/80'
                      text = 'text-emerald-100'
                    }
                    if (isNeighbor && !isCurrent) {
                      border = isNeighborAt
                        ? 'border-sky-400/80'
                        : 'border-sky-200/50'
                    }

                    if (isActiveNeighbor && !isCurrent) {
                      // The specific neighbor being checked in this step
                      border = 'border-sky-300'
                      bg = 'bg-red-500/35'
                    }

                    if (isCurrent) {
                      // Blue focus ring for the cursor position
                      ring =
                        'shadow-[0_0_0_1px_rgba(56,189,248,0.9),0_0_18px_rgba(56,189,248,0.5)]'
                      if (
                        currentStep.accessible &&
                        currentStep.row === i &&
                        currentStep.col === j
                      ) {
                        // Slight green tint while on this cell, but no halo yet
                        bg = 'bg-emerald-500/35'
                      } else {
                        bg = 'bg-sky-500/30'
                      }
                    } else if (showQueuedHalo && isAt) {
                      // We have already moved past this cell, and it's accessible
                      // in this scan -> show green halo now.
                      ring =
                        'shadow-[0_0_0_1px_rgba(52,211,153,0.8),0_0_16px_rgba(52,211,153,0.35)]'
                    }

                    return (
                      <motion.div
                        key={`${i}-${j}-${stepIndex}`}
                        className={`group relative flex h-7 w-7 items-center justify-center rounded-md sm:h-8 sm:w-8 ${bg} ${border} ${ring}`}
                        layout
                        transition={{ duration: 0.25, ease: EASING }}
                      >
                        <span
                          className={`font-mono text-xs sm:text-sm ${text}`}
                        >
                          {logicalChar}
                        </span>
                      </motion.div>
                    )
                  }),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
