// Helt AI-genererad

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ModalProps = {
  title?: React.ReactNode
  content?: React.ReactNode
  onClose: () => void
  isOpen?: boolean
}

type Particle = {
  id: number
  color: string
  dx: number
  dy: number
  delay: number
  size: number
  rotate: number
  originX: number | string
  originY: number | string
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const panelVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.96, rotate: 0 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotate: [0, -3, 2, -1, 0],
  },
  exit: { y: 40, opacity: 0, scale: 0.96, rotate: 0 },
}

const COLORS = [
  '#FFD166',
  '#EF476F',
  '#06D6A0',
  '#118AB2',
  '#073B4C',
  '#FFA69E',
  '#B5838D',
  '#06AED5',
]

const createBorderParticles = (countPerEdge = 6): Particle[] => {
  const arr: Particle[] = []
  const now = Date.now()

  // top edge
  for (let i = 0; i < countPerEdge; i++) {
    const distance = 70 + Math.random() * 90
    arr.push({
      id: now + arr.length,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      originX: `${10 + Math.random() * 80}%`, // percent across the top
      originY: 0,
      dx: (Math.random() - 0.5) * 40,
      dy: -distance,
      delay: Math.random() * 0.12,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })
  }

  // bottom edge
  for (let i = 0; i < countPerEdge; i++) {
    const distance = 70 + Math.random() * 90
    arr.push({
      id: now + arr.length,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      originX: `${15 + Math.random() * 70}%`,
      originY: '100%',
      dx: (Math.random() - 0.5) * 40,
      dy: distance,
      delay: Math.random() * 0.12,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })
  }

  // left edge
  for (let i = 0; i < countPerEdge; i++) {
    const distance = 70 + Math.random() * 90
    arr.push({
      id: now + arr.length,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      originX: 0,
      originY: `${15 + Math.random() * 70}%`,
      dx: -distance,
      dy: (Math.random() - 0.5) * 40,
      delay: Math.random() * 0.12,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })
  }

  // right edge
  for (let i = 0; i < countPerEdge; i++) {
    const distance = 70 + Math.random() * 90
    arr.push({
      id: now + arr.length,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      originX: '100%',
      originY: `${15 + Math.random() * 70}%`,
      dx: distance,
      dy: (Math.random() - 0.5) * 40,
      delay: Math.random() * 0.12,
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })
  }

  return arr
}

const Modal: React.FC<ModalProps> = ({
  title,
  content,
  onClose,
  isOpen = true,
}) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      const p = createBorderParticles(6)
      setParticles(p)
      const t = setTimeout(() => setParticles([]), 1200)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            background: 'rgba(7,10,25,0.6)',
            backdropFilter: 'blur(4px)',
            padding: 20,
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              y: { type: 'spring', stiffness: 520, damping: 34 },
              scale: { type: 'spring', stiffness: 420, damping: 30 },
              rotate: { duration: 0.3, ease: 'easeInOut' },
            }}
            style={{
              position: 'relative',
              background: 'linear-gradient(180deg,#ffffff,#f6f7ff)',
              color: '#0f172a',
              borderRadius: 12,
              padding: 18,
              width: 'min(90vw, 300px)',
              maxHeight: '82vh',
              // important: allow fireworks to spill out
              overflow: 'visible',
              boxShadow: '0 20px 50px rgba(2,6,23,0.35)',
              border: '1px solid rgba(15,23,42,0.06)',
            }}
          >
            {/* fireworks layer */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                  animate={{
                    x: p.dx,
                    y: p.dy,
                    opacity: 0,
                    scale: 0.6,
                    rotate: p.rotate,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: 'circOut',
                    delay: p.delay,
                  }}
                  style={{
                    position: 'absolute',
                    left: p.originX,
                    top: p.originY,
                    width: p.size,
                    height: p.size,
                    borderRadius: '50%',
                    background: p.color,
                    boxShadow: `0 6px 14px ${p.color}66`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>

            <h2 style={{ margin: 0, marginBottom: 10, fontSize: 18 }}>
              {title}
            </h2>

            {/* scrollable inner content */}
            <div
              style={{
                marginBottom: 14,
                fontSize: 14,
                maxHeight: '56vh',
                overflow: 'auto',
              }}
            >
              {content}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#0f172a',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Alright
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
