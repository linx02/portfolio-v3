'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'

export function Accordion({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode
  title: string
  content: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-xl bg-zinc-900 p-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer justify-between"
      >
        <span className="flex items-center space-x-2">
          {icon}
          <span className="text-left">{title}</span>
        </span>
        <ChevronDown
          className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen && content}
        </motion.div>
      )}
    </div>
  )
}
