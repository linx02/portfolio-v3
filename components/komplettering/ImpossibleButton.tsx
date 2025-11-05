import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const SAFE_RADIUS = 140
const MAX_OFFSET = 220

export default function ImpossibleButton() {
  const [canTab, setCanTab] = useState(false)
  const [buttonCheck, setButtonCheck] = useState('null')

  // Sätter upp getter och setter för window.secretSwitch
  useEffect(() => {
    if (typeof window === 'undefined') return

    let currentVal = (window as any).secretSwitch ?? false

    Object.defineProperty(window, 'secretSwitch', {
      configurable: true,
      get() {
        return currentVal
      },
      set(val) {
        currentVal = !!val
        setCanTab(currentVal)
      },
    })

    setCanTab(!!currentVal)
  }, [])

  const [key, setKey] = useState<string>('')
  const [value, setValue] = useState<string>('')

  const containerRef = useRef<HTMLDivElement | null>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setContainerSize({ w: rect.width, h: rect.height })
  }, [])

  useEffect(() => {}, [canTab])

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const centerX = rect.width / 2 + x.get()
    const centerY = rect.height / 2 + y.get()

    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const dist = Math.hypot(dx, dy)

    if (dist > SAFE_RADIUS) return

    const pushStrength = (SAFE_RADIUS - dist) / SAFE_RADIUS
    const awayX = -dx * pushStrength * 1.4
    const awayY = -dy * pushStrength * 1.4

    let newX = x.get() + awayX
    let newY = y.get() + awayY

    newX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, newX))
    newY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, newY))

    x.set(newX)
    y.set(newY)
  }

  function resetPosition() {
    x.set(0)
    y.set(0)
  }

  const handleClick = () => {
    // "Säkerställer" att knappen trycktes på genom att sätta detta UUID som sen används av window.deriveId()
    setButtonCheck('4a131074-765a-4ab1-a6eb-cc9dfe6b84c7')
    localStorage.setItem(key, value)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPosition}
      style={{
        width: '100%',
        maxWidth: 500,
        height: 300,
        margin: '4rem auto',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'radial-gradient(circle at top, #101827, #020617 60%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="flex w-full flex-col items-center justify-center">
        <input
          placeholder="Nyckel"
          className="mt-16 rounded-2xl border border-zinc-700 bg-zinc-900 py-2 pl-2"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          placeholder="Värde"
          className="mt-2 rounded-2xl border border-zinc-700 bg-zinc-900 py-2 pl-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <motion.button
        tabIndex={canTab ? 0 : -1}
        disabled={!canTab}
        style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          translateX: '-50%',
          translateY: '-50%',
          x: springX,
          y: springY,
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          border: 'none',
          color: 'white',
          padding: '0.9rem 1.5rem',
          borderRadius: 999,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 20px 35px rgba(99,102,241,0.25)',
        }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
      >
        Sätt localStorage
      </motion.button>
      {/* Används sen av window.deriveId()*/}
      <span className="hidden" id="buttonCheck">
        {buttonCheck}
      </span>
    </div>
  )
}
