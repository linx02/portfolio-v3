'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Direction = 'L' | 'R'

interface Instruction {
  dir: Direction
  value: number
  raw: string
}

const RAW_INPUT = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
`

const PIN_COUNT = 100
const STEP_ANGLE = 360 / PIN_COUNT
const INITIAL_INDEX = 50
const STEP_PAUSE_MS = 1000 // pause between instructions

const parseInput = (raw: string): Instruction[] =>
  raw
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((line) => ({
      dir: line[0] as Direction,
      value: Number(line.slice(1)),
      raw: line,
    }))

const INSTRUCTIONS = parseInput(RAW_INPUT)

interface MachineState {
  i: number // current index 0–99
  instrIdx: number // which instruction we're on
  remaining: number // steps left in current instruction
  c1: number
  c2: number
  done: boolean
}

// Tick-accurate simulation of your Python rotate() loop
function tickMachine(prev: MachineState): MachineState {
  if (prev.done) return prev
  if (prev.instrIdx >= INSTRUCTIONS.length) {
    return { ...prev, done: true, remaining: 0 }
  }

  const instr = INSTRUCTIONS[prev.instrIdx]

  // Between instructions: remaining === 0 → load new instruction but don't move yet
  if (prev.remaining === 0) {
    if (instr.value <= 0) {
      const nextIdx = prev.instrIdx + 1
      const done = nextIdx >= INSTRUCTIONS.length
      return {
        ...prev,
        instrIdx: nextIdx,
        remaining: 0,
        done,
      }
    }
    return {
      ...prev,
      remaining: instr.value,
    }
  }

  // In the middle of an instruction: perform one tick
  let i = prev.i
  let v = prev.remaining
  let c1 = prev.c1
  let c2 = prev.c2
  let instrIdx = prev.instrIdx

  if (instr.dir === 'L') {
    i -= 1
    if (i === -1) i = 99
  } else {
    i += 1
    if (i === 100) i = 0
  }

  v -= 1

  // Mirror the Python logic:
  // if v == 0 and i == 0: c1 += 1
  // if v != 0 and i == 0: c2 += 1
  if (v === 0 && i === 0) {
    c1 += 1
  } else if (v !== 0 && i === 0) {
    c2 += 1
  }

  if (v === 0) {
    instrIdx += 1
    const done = instrIdx >= INSTRUCTIONS.length
    return {
      i,
      instrIdx,
      remaining: 0,
      c1,
      c2,
      done,
    }
  }

  return {
    i,
    instrIdx,
    remaining: v,
    c1,
    c2,
    done: false,
  }
}

// Dynamic tick speed: smaller steps → slower ticks, bigger steps → faster
function getTickMsForInstruction(instr?: Instruction): number {
  const BASE_TICK_MS = 40

  if (!instr) return BASE_TICK_MS
  const steps = Math.max(1, instr.value)

  // factor ~ 2 for tiny steps, ~0.3 for huge steps, clamped
  const factor = Math.max(0.3, Math.min(2.0, 20 / steps))

  return BASE_TICK_MS * factor
}

export default function AoC1() {
  const [machine, setMachine] = useState<MachineState>({
    i: INITIAL_INDEX,
    instrIdx: 0,
    remaining: 0,
    c1: 0,
    c2: 0,
    done: false,
  })

  const [isRunning, setIsRunning] = useState(true)

  const currentInstr =
    !machine.done && machine.instrIdx < INSTRUCTIONS.length
      ? INSTRUCTIONS[machine.instrIdx]
      : undefined

  const tickMs = getTickMsForInstruction(currentInstr)

  const dialAngle = -machine.i * STEP_ANGLE

  const solve1 = machine.c1
  const solve2 = machine.c1 + machine.c2

  useEffect(() => {
    if (!isRunning || machine.done) return

    const delay = machine.remaining === 0 ? STEP_PAUSE_MS : tickMs

    const id = window.setTimeout(() => {
      setMachine((prev) => tickMachine(prev))
    }, delay)

    return () => window.clearTimeout(id)
  }, [isRunning, machine.done, machine.remaining, machine.instrIdx, tickMs])

  const handleReset = () => {
    setMachine({
      i: INITIAL_INDEX,
      instrIdx: 0,
      remaining: 0,
      c1: 0,
      c2: 0,
      done: false,
    })
    setIsRunning(true)
  }

  let currentStep: number
  if (machine.done || machine.instrIdx >= INSTRUCTIONS.length) {
    currentStep = INSTRUCTIONS.length
  } else if (machine.remaining === 0) {
    currentStep = machine.instrIdx
  } else {
    currentStep = machine.instrIdx + 1
  }

  useEffect(() => {
    if (machine.done) {
      setTimeout(() => {
        handleReset()
      }, 5000)
    }
  }, [machine.done])

  return (
    <div className="flex w-full flex-col items-center gap-8 rounded-3xl border border-white/10 bg-gradient-to-b from-black to-neutral-900 p-6 text-white md:p-8">
      <div className="flex w-full flex-col items-center justify-between gap-8 md:flex-row">
        <div className="relative flex items-center justify-center">
          <div className="relative h-72 w-72 md:h-80 md:w-80">
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: dialAngle }}
              transition={{
                type: 'tween',
                ease: [0.22, 0.61, 0.36, 1],
                duration: Math.min(0.25, tickMs / 1000),
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full border border-neutral-700 bg-[#111111] shadow-[0_0_60px_rgba(0,0,0,0.6)]">
                {Array.from({ length: PIN_COUNT }, (_, n) => {
                  const angle = n * STEP_ANGLE
                  const isMajor = n % 10 === 0

                  return (
                    <div
                      key={n}
                      className="absolute inset-0"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        transformOrigin: '50% 50%',
                      }}
                    >
                      <div className="absolute top-[10px] left-1/2 flex -translate-x-1/2 flex-col items-center">
                        <div
                          className={`rounded-full ${
                            isMajor ? 'h-3 w-[3px]' : 'h-2 w-[2px]'
                          } bg-white/80`}
                        />
                        {isMajor && (
                          <div className="font-book mt-1 text-center text-[9px] tracking-tight text-white/70">
                            {n}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
              <div className="h-0 w-0 rotate-180 border-t-[12px] border-r-[8px] border-l-[8px] border-t-emerald-400 border-r-transparent border-l-transparent" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
              <div className="mt-2 text-4xl font-semibold tabular-nums">
                {machine.i}
              </div>
            </div>
          </div>
        </div>

        {/* Right side: instructions + counters */}
        <div className="flex max-w-md flex-1 flex-col gap-4">
          {/* Instructions list */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-xs tracking-[0.2em] text-white/40 uppercase">
                Input
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span>
                  Steg {currentStep}/{INSTRUCTIONS.length}
                </span>
              </div>
            </div>
            <div className="space-y-1.5 font-mono text-sm">
              {INSTRUCTIONS.map((instr, idx) => {
                const isCurrent =
                  !machine.done &&
                  idx === machine.instrIdx &&
                  machine.remaining > 0
                const isDone = machine.done || idx < machine.instrIdx

                return (
                  <motion.div
                    key={instr.raw + idx}
                    className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                      isCurrent
                        ? 'border border-emerald-500/40 bg-emerald-500/15'
                        : isDone
                          ? 'border border-white/5 bg-white/5'
                          : 'border border-transparent'
                    }`}
                    layout
                  >
                    <span
                      className={`tabular-nums ${
                        isCurrent
                          ? 'text-emerald-200'
                          : isDone
                            ? 'text-white/70'
                            : 'text-white/60'
                      }`}
                    >
                      {instr.raw}
                    </span>
                    <span className="text-[11px] text-white/35">
                      {instr.dir === 'L' ? '←' : '→'} {instr.value}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
