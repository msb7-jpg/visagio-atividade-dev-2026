'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export const LayoutTextFlip = ({
  text = 'Build Amazing',
  words = ['Landing Pages', 'Component Blocks', 'Page Sections', '3D Shaders'],
  duration = 3000,
  className,
  textClassName,
  wordClassName,
  onIndexChange
}: {
  text?: string
  words: string[]
  duration?: number
  className?: string
  textClassName?: string
  wordClassName?: string
  onIndexChange?: (index: number) => void
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % words.length
        onIndexChange?.(nextIndex)
        return nextIndex
      })
    }, duration)

    return () => clearInterval(interval)
  }, [duration, words.length, onIndexChange])

  return (
    <div className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      {text && (
        <motion.span
          layoutId="subtext"
          className={cn('text-xl font-bold tracking-tight text-foreground md:text-2xl', textClassName)}
        >
          {text}
        </motion.span>
      )}

      <motion.span
        layout
        className={cn(
          'relative w-fit overflow-hidden rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 font-sans text-xl font-extrabold tracking-tight text-primary shadow-sm drop-shadow-md backdrop-blur-sm md:text-2xl',
          wordClassName
        )}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -30, filter: 'blur(8px)', opacity: 0 }}
            animate={{
              y: 0,
              filter: 'blur(0px)',
              opacity: 1
            }}
            exit={{ y: 35, filter: 'blur(8px)', opacity: 0 }}
            transition={{
              duration: 0.45,
              ease: 'easeInOut'
            }}
            className="inline-block whitespace-nowrap"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </div>
  )
}
